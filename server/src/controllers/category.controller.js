import { supabaseAdmin } from '../config/supabase.js';
import { isSupabaseConfigured } from '../config/index.js';
import { localStore } from '../services/store.js';

export const getCategories = async (req, res) => {
  try {
    if (isSupabaseConfigured) {
      const { data, error } = await supabaseAdmin
        .from('categories')
        .select('*')
        .eq('is_active', true)
        .order('name');

      if (!error && data) {
        return res.status(200).json({ status: 'ok', data });
      }
    }

    return res.status(200).json({
      status: 'ok',
      data: localStore.categories,
    });
  } catch (err) {
    return res.status(200).json({ status: 'ok', data: localStore.categories });
  }
};

export const getLocations = async (req, res) => {
  try {
    if (isSupabaseConfigured) {
      const { data, error } = await supabaseAdmin
        .from('campus_locations')
        .select('*')
        .eq('is_active', true)
        .order('name');

      if (!error && data) {
        return res.status(200).json({ status: 'ok', data });
      }
    }

    return res.status(200).json({
      status: 'ok',
      data: localStore.campus_locations,
    });
  } catch (err) {
    return res.status(200).json({ status: 'ok', data: localStore.campus_locations });
  }
};
