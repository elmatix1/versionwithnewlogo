
import { useAddDriver } from './operations/useAddDriver';
import { useUpdateDriver } from './operations/useUpdateDriver';
import { useDeleteDriver } from './operations/useDeleteDriver';

export function useDriversOperations() {
  const { addDriver } = useAddDriver();
  const { updateDriver } = useUpdateDriver();
  const { deleteDriver } = useDeleteDriver();

  return { addDriver, updateDriver, deleteDriver };
}
