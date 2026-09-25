import { NewParcelForm } from "@/components/admin/NewParcelForm";

export default function NewParcelPage() {
  return (
    <div className="u-stack u-stack--8 max-w-2xl">
      <h1 className="font-serif text-3xl">New parcel</h1>
      <NewParcelForm />
    </div>
  );
}
