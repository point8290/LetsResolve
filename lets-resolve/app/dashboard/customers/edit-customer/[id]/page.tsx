import { fetchCustomer } from "@/lib/customerAction";
import CustomerForm from "@/ui/customers/customer-form";

export default async function EditCustomer({
  params,
}: {
  params: { id: string };
}) {
  const customer = await fetchCustomer(params.id);
  return <CustomerForm isEditForm={true} customer={customer} />;
}
