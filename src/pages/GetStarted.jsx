import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import StepIndicator from '../components/setup/StepIndicator';
import BuildingDetailsStep from '../components/setup/BuildingDetailsStep';
import ChooseCodesStep from '../components/setup/ChooseCodesStep';
import ReviewStep from '../components/setup/ReviewStep';
import PaymentStep from '../components/setup/PaymentStep';
import { generateSecurityCode, generateUnitCode, generateUnitLabels } from '../lib/codeGenerator';
import { api } from '@/lib/api';
import { useAuth } from '@/lib/AuthContext';

const PRICE_PER_CODE = 150;

export default function GetStarted() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [step, setStep] = useState(1);
  const [data, setData] = useState({
    building_name: '',
    building_address: '',
    number_of_units: 0,
    numbering_format: 'numeric',
    manager_name: user?.user_metadata?.full_name || '',
    manager_email: user?.email || '',
    manager_phone: '',
    emergency_contacts: '',
    max_visitors: 3,
    sleepover_fee: 0,
    house_rules_url: '',
    student_code_limit: 1,
  });

  useEffect(() => {
    setData((prev) => ({
      ...prev,
      manager_name: prev.manager_name || user?.user_metadata?.full_name || '',
      manager_email: prev.manager_email || user?.email || '',
    }));
  }, [user?.email, user?.user_metadata?.full_name]);

  const handleComplete = async () => {
    const securityCode = generateSecurityCode();
    const codeLimit = data.student_code_limit || 1;
    const total = codeLimit * PRICE_PER_CODE;
    const startDate = new Date();
    const expiryDate = new Date();
    expiryDate.setMonth(expiryDate.getMonth() + 1);

    const residence = await api.entities.Residence.create({
      ...data,
      security_code: securityCode,
      student_code_limit: codeLimit,
      codes_purchased: codeLimit,
      subscription_status: 'active',
      subscription_expires_at: expiryDate.toISOString(),
      billing_cycle_start: startDate.toISOString(),
      billing_cycle_end: expiryDate.toISOString(),
      last_payment_date: startDate.toISOString(),
      owner_email: user?.email,
      monthly_total: total,
    });

    const labels = generateUnitLabels(codeLimit, data.numbering_format);
    const units = labels.map((label) => ({
      residence_id: residence.id,
      unit_label: label,
      unit_code: generateUnitCode(),
      is_active: true,
    }));

    await api.entities.Unit.bulkCreate(units);
    navigate('/dashboard');
  };

  return (
    <div className="py-16 lg:py-24 min-h-[80vh]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Set Up Your Building</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Complete the steps below to get started with ResLiving
          </p>
        </div>

        <StepIndicator currentStep={step} />

        <motion.div
          key={step}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          {step === 1 && (
            <BuildingDetailsStep
              data={data}
              setData={setData}
              onNext={() => setStep(2)}
            />
          )}
          {step === 2 && (
            <ChooseCodesStep
              data={data}
              setData={setData}
              onNext={() => setStep(3)}
              onBack={() => setStep(1)}
            />
          )}
          {step === 3 && (
            <ReviewStep
              data={data}
              onNext={() => setStep(4)}
              onBack={() => setStep(2)}
            />
          )}
          {step === 4 && (
            <PaymentStep
              data={data}
              onBack={() => setStep(3)}
              onComplete={handleComplete}
            />
          )}
        </motion.div>
      </div>
    </div>
  );
}
