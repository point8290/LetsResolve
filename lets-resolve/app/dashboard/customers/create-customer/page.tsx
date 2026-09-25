import CustomerForm from "@/ui/customers/customer-form";

export default function CreateCustomer() {
  return <CustomerForm isEditForm={false} customer={undefined} />;
}
