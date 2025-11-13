import axiosClient from '../services/axiosClient';

export const getAllRules = async () => {
  try {
    const response = await axiosClient.get('/api/rules');
    return response.data;
  } catch (error) {
    console.error('Error fetching all rules:', error);
    throw error;
  }
};

export const getRuleById = async (ruleId) => {
  try {
    const response = await axiosClient.get(`/api/rules/${ruleId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching rule by ID:', error);
    throw error;
  }
};

export const createRule = async (ruleData) => {
  try {
    const response = await axiosClient.post('/api/rules', ruleData);
    return response.data;
  } catch (error) {
    console.error('Error creating rule:', error);
    throw error;
  }
};

export const updateRule = async (id, ruleData) => {
  try {
    const response = await axiosClient.put(`/api/rules/${id}`, ruleData);
    return response.data;
  } catch (error) {
    console.error('Error updating rule:', error);
    throw error;
  }
};

export const deleteRule = async (id) => {
  try {
    const response = await axiosClient.delete(`/api/rules/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting rule:', error);
    throw error;
  }
};

export const getAllRuleConditions = async () => {
  try {
    const response = await axiosClient.get('/api/rule-conditions');
    return response.data;
  } catch (error) {
    console.error('Error fetching all rule conditions:', error);
    throw error;
  }
};

export const getRuleConditionsByRuleId = async (ruleId) => {
  try {
    const response = await axiosClient.get(`/api/rule-conditions/rule/${ruleId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching rule conditions by rule ID:', error);
    throw error;
  }
};

export const createRuleCondition = async (conditionData) => {
  try {
    const response = await axiosClient.post('/api/rule-conditions', conditionData);
    return response.data;
  } catch (error) {
    console.error('Error creating rule condition:', error);
    throw error;
  }
};

export const updateRuleCondition = async (id, conditionData) => {
  try {
    const response = await axiosClient.put(`/api/rule-conditions/${id}`, conditionData);
    return response.data;
  } catch (error) {
    console.error('Error updating rule condition:', error);
    throw error;
  }
};

export const deleteRuleCondition = async (id) => {
  try {
    const response = await axiosClient.delete(`/api/rule-conditions/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting rule condition:', error);
    throw error;
  }
};
