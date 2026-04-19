import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import StepIndicator from '../components/setup/StepIndicator';
import BuildingDetailsStep from '../components/setup/BuildingDetailsStep';
import ChooseCodesStep from '../components/setup/ChooseCodesStep';
import ReviewStep from '../components/setup/ReviewStep';
import PaymentStep from '../components/setup/PaymentStep';
import { useAuth } from '@/lib/AuthContext';
import { supabase } from '@/lib/supabase';

const PRICE_PER_CODE = 150;

export default function GetStarted() {
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
    emergency_ambulance: '',
    emergency_fire: '',
    emergency_police: '',
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
    const codeLimit = data.student_code_limit || 1;
    const total = codeLimit * PRICE_PER_CODE;

    const payload = {
      building_name: data.building_name,
      building_address: data.building_address,
      number_of_units: Number(data.number_of_units || 0),
      numbering_format: data.numbering_format,
      manager_name: data.manager_name,
      manager_email: data.manager_email || user?.email,
      manager_phone: data.manager_phone,
      emergency_ambulance: data.emergency_ambulance,
      emergency_fire: data.emergency_fire,
      emergency_police: data.emergency_police,
      max_visitors: Number(data.max_visitors || 0),
      sleepover_fee: Number(data.sleepover_fee || 0),
      house_rules_url: data.house_rules_url || '',
      student_code_limit: Number(codeLimit),
      monthly_total: Number(total),
      owner_email: user?.email || data.manager_email,
    };

    const { data: result, error } = await supabase.functions.invoke(
      'initialize-paystack',
      {
        body: payload,
      }
    );

    if (error) {
      throw new Error(error.message || 'Failed to start Paystack checkout.');
    }

    if (!result?.authorization_url) {
      throw new Error('No Paystack checkout URL was returned.');
    }

    window.location.href = result.authorization_url;
  };

  return (
    <div className="py-16 lg:py-24 min-h-[80vh]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
            Set Up Your Building
          </h1>
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