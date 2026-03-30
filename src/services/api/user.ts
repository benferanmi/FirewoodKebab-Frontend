import client from './client';
import type { UpdateProfileDTO, AddressDTO } from '@/types';

export const userAPI = {
  getProfile: () => client.get('/user/profile'),
  updateProfile: (data: UpdateProfileDTO) => client.put('/user/profile', data),
  getAddresses: () => client.get('/user/addresses'),
  addAddress: (data: AddressDTO) => client.post('/user/addresses', data),
  updateAddress: (id: string, data: AddressDTO) => client.put(`/user/addresses/${id}`, data),
  deleteAddress: (id: string) => client.delete(`/user/addresses/${id}`),
  setDefaultAddress: (id: string) => client.put(`/user/addresses/${id}/set-default`),
  deleteAccount: (password: string) => client.delete('/user/account', { data: { password } }),
};
