import { AdminTopbar } from "@/components/admin/AdminTopbar";
import { ServiceForm } from "@/components/admin/services/ServiceForm";

export default function NewServicePage() {
  return (
    <>
      <AdminTopbar title="New Service" />
      <div className="flex-1 p-6">
        <ServiceForm />
      </div>
    </>
  );
}
