import { supabase } from '@/lib/supabase';

const TABLES = {
  Residence: 'residences',
  Unit: 'units',
};

function normalizeResidence(row) {
  if (!row) return row;
  return {
    ...row,
    building_name: row.building_name ?? row.name,
    building_address: row.building_address ?? row.address,
    number_of_units: row.number_of_units ?? row.num_units,
    monthly_total: row.monthly_total ?? (Number(row.codes_purchased || row.student_code_limit || 0) * 150),
    student_code_limit: row.student_code_limit ?? row.codes_purchased ?? 0,
    created_date: row.created_at,
    updated_date: row.updated_at,
  };
}

function normalizeUnit(row) {
  if (!row) return row;
  return {
    ...row,
    unit_label: row.unit_label ?? row.unit_number,
    created_date: row.created_at,
    updated_date: row.updated_at,
  };
}

function normalize(table, row) {
  if (table === 'residences') return normalizeResidence(row);
  if (table === 'units') return normalizeUnit(row);
  return row;
}

function mapResidencePayload(payload) {
  if (!payload) return payload;
  return {
    name: payload.building_name ?? payload.name,
    address: payload.building_address ?? payload.address,
    num_units: payload.number_of_units ?? payload.num_units,
    numbering_format: payload.numbering_format,
    manager_name: payload.manager_name,
    manager_email: payload.manager_email,
    manager_phone: payload.manager_phone,
    emergency_contacts: payload.emergency_contacts,
    max_visitors: payload.max_visitors,
    sleepover_fee: payload.sleepover_fee,
    house_rules_url: payload.house_rules_url,
    security_code: payload.security_code,
    subscription_status: payload.subscription_status,
    subscription_expires_at: payload.subscription_expires_at,
    student_code_limit: payload.student_code_limit,
    codes_purchased: payload.codes_purchased ?? payload.student_code_limit,
    billing_cycle_start: payload.billing_cycle_start,
    billing_cycle_end: payload.billing_cycle_end ?? payload.subscription_expires_at,
    last_payment_date: payload.last_payment_date,
    owner_email: payload.owner_email ?? payload.manager_email,
  };
}

function mapUnitPayload(payload) {
  if (!payload) return payload;
  return {
    residence_id: payload.residence_id,
    unit_number: payload.unit_label ?? payload.unit_number,
    unit_code: payload.unit_code,
    is_occupied: payload.is_occupied ?? false,
  };
}

function parseSort(sort) {
  if (!sort) return null;
  const descending = sort.startsWith('-');
  const key = descending ? sort.slice(1) : sort;
  const mapping = { created_date: 'created_at', unit_label: 'unit_number', building_name: 'name' };
  return { column: mapping[key] || key, ascending: !descending };
}

async function getUser() {
  const { data, error } = await supabase.auth.getUser();
  if (error) throw error;
  return data.user;
}

async function signIn({ email, password }) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
  return data;
}

async function signUp({ email, password, full_name }) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { full_name } },
  });
  if (error) throw error;
  return data;
}

async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

function entity(name) {
  const table = TABLES[name];
  return {
    async list() {
      const { data, error } = await supabase.from(table).select('*');
      if (error) throw error;
      return (data || []).map((row) => normalize(table, row));
    },
    async filter(criteria = {}, sort) {
      let query = supabase.from(table).select('*');
      Object.entries(criteria).forEach(([key, value]) => {
        if (value === undefined || value === null || value === '') return;
        const columnMap = table === 'residences'
          ? { building_name: 'name', building_address: 'address', number_of_units: 'num_units' }
          : { unit_label: 'unit_number' };
        query = query.eq(columnMap[key] || key, value);
      });
      const sortConfig = parseSort(sort);
      if (sortConfig) query = query.order(sortConfig.column, { ascending: sortConfig.ascending });
      const { data, error } = await query;
      if (error) throw error;
      return (data || []).map((row) => normalize(table, row));
    },
    async create(payload) {
      const mapped = table === 'residences' ? mapResidencePayload(payload) : mapUnitPayload(payload);
      const { data, error } = await supabase.from(table).insert(mapped).select('*').single();
      if (error) throw error;
      return normalize(table, data);
    },
    async bulkCreate(payloads) {
      const mapped = payloads.map((payload) => table === 'residences' ? mapResidencePayload(payload) : mapUnitPayload(payload));
      const { data, error } = await supabase.from(table).insert(mapped).select('*');
      if (error) throw error;
      return (data || []).map((row) => normalize(table, row));
    },
    async update(id, payload) {
      const mapped = table === 'residences' ? mapResidencePayload(payload) : mapUnitPayload(payload);
      const { data, error } = await supabase.from(table).update(mapped).eq('id', id).select('*').single();
      if (error) throw error;
      return normalize(table, data);
    },
  };
}

async function uploadAsset({ file, category = 'uploads', residenceId = 'unassigned', userId = 'anonymous', bucket = 'app-uploads' }) {
  const ext = file.name.split('.').pop() || 'bin';
  const path = `${category}/${residenceId}/${userId}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext.toLowerCase()}`;
  const { error } = await supabase.storage.from(bucket).upload(path, file, { upsert: false, contentType: file.type || 'application/octet-stream' });
  if (error) throw error;
  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  return { file_url: data.publicUrl, path };
}

export const api = {
  auth: { getUser, signIn, signUp, signOut },
  entities: { Residence: entity('Residence'), Unit: entity('Unit') },
  storage: { uploadAsset },
};
