import { useState } from "react";
import { User, Phone, Mail, MapPin, Heart, Plus, Trash2, Shield, Calendar, Users, AlertCircle } from "lucide-react";

export function PersonalTab({ employee }) {
  const [contacts, setContacts] = useState([
    { id: "c1", name: "Eleanor Vance", relationship: "Spouse", phone: "+1 (555) 234-5678", email: "eleanor.vance@example.com", priority: "Primary" },
    { id: "c2", name: "Marcus Vance", relationship: "Brother", phone: "+1 (555) 876-5432", email: "marcus.vance@example.com", priority: "Secondary" },
  ]);

  const [dependents, setDependents] = useState([
    { id: "d1", name: "Leo Vance", relationship: "Child", dob: "2018-05-12", medicalCovered: true },
    { id: "d2", name: "Maya Vance", relationship: "Child", dob: "2021-09-24", medicalCovered: true },
  ]);

  const [contactModal, setContactModal] = useState(false);
  const [newContact, setNewContact] = useState({ name: "", relationship: "Spouse", phone: "", email: "", priority: "Secondary" });

  const [dependentModal, setDependentModal] = useState(false);
  const [newDependent, setNewDependent] = useState({ name: "", relationship: "Child", dob: "", medicalCovered: true });

  const handleAddContact = (e) => {
    e.preventDefault();
    if (!newContact.name || !newContact.phone) return;
    setContacts((prev) => [...prev, { ...newContact, id: `c_${Date.now()}` }]);
    setNewContact({ name: "", relationship: "Spouse", phone: "", email: "", priority: "Secondary" });
    setContactModal(false);
  };

  const handleAddDependent = (e) => {
    e.preventDefault();
    if (!newDependent.name || !newDependent.dob) return;
    setDependents((prev) => [...prev, { ...newDependent, id: `d_${Date.now()}` }]);
    setNewDependent({ name: "", relationship: "Child", dob: "", medicalCovered: true });
    setDependentModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Personal Identity Details */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-2xs space-y-4">
        <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider flex items-center gap-2">
          <User className="w-4 h-4 text-indigo-500" />
          Personal & Bio Details
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-xs">
          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
            <span className="text-slate-400 block text-[10px] uppercase font-bold">Legal Full Name</span>
            <span className="font-extrabold text-slate-800 dark:text-slate-200 text-sm mt-0.5 block">{employee?.full_name}</span>
          </div>
          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
            <span className="text-slate-400 block text-[10px] uppercase font-bold">Date of Birth</span>
            <span className="font-extrabold text-slate-800 dark:text-slate-200 text-sm mt-0.5 block">1992-08-14</span>
          </div>
          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
            <span className="text-slate-400 block text-[10px] uppercase font-bold">Gender & Pronouns</span>
            <span className="font-extrabold text-slate-800 dark:text-slate-200 text-sm mt-0.5 block">Female (She/Her)</span>
          </div>
          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
            <span className="text-slate-400 block text-[10px] uppercase font-bold">Personal Email</span>
            <span className="font-extrabold text-slate-800 dark:text-slate-200 text-sm mt-0.5 block">{employee?.email}</span>
          </div>
          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
            <span className="text-slate-400 block text-[10px] uppercase font-bold">Mobile Phone</span>
            <span className="font-extrabold text-slate-800 dark:text-slate-200 text-sm mt-0.5 block">{employee?.phone || "+1 (555) 019-2834"}</span>
          </div>
          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
            <span className="text-slate-400 block text-[10px] uppercase font-bold">Residential Address</span>
            <span className="font-extrabold text-slate-800 dark:text-slate-200 text-sm mt-0.5 block">{employee?.address || "742 Evergreen Terrace, Austin, TX 78701"}</span>
          </div>
        </div>
      </div>

      {/* Emergency Contacts */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-2xs space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider flex items-center gap-2">
            <Phone className="w-4 h-4 text-rose-500" />
            Emergency Contacts
          </h3>
          <button
            onClick={() => setContactModal(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold text-xs hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Contact</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {contacts.map((c) => (
            <div key={c.id} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 flex items-start justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-900 dark:text-slate-100 text-sm">{c.name}</span>
                  <span className="px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400">
                    {c.priority}
                  </span>
                </div>
                <p className="text-xs text-slate-500 font-semibold">{c.relationship}</p>
                <div className="text-xs text-slate-400 space-y-0.5 pt-1">
                  <p className="flex items-center gap-1.5"><Phone className="w-3 h-3 text-indigo-500" /> {c.phone}</p>
                  <p className="flex items-center gap-1.5"><Mail className="w-3 h-3 text-indigo-500" /> {c.email}</p>
                </div>
              </div>
              <button
                onClick={() => setContacts((prev) => prev.filter((i) => i.id !== c.id))}
                className="p-1.5 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/50 transition-colors cursor-pointer"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Dependents & Beneficiaries */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-2xs space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider flex items-center gap-2">
            <Users className="w-4 h-4 text-indigo-500" />
            Dependents & Medical Coverage
          </h3>
          <button
            onClick={() => setDependentModal(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold text-xs hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Dependent</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {dependents.map((d) => (
            <div key={d.id} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 flex items-start justify-between">
              <div className="space-y-1">
                <span className="font-bold text-slate-900 dark:text-slate-100 text-sm block">{d.name}</span>
                <p className="text-xs text-slate-500 font-semibold">{d.relationship} • Born {d.dob}</p>
                <span className="inline-block mt-2 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300">
                  {d.medicalCovered ? "Covered under Health Plan" : "No Medical Plan"}
                </span>
              </div>
              <button
                onClick={() => setDependents((prev) => prev.filter((i) => i.id !== d.id))}
                className="p-1.5 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/50 transition-colors cursor-pointer"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Add Emergency Contact Modal */}
      {contactModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 max-w-md w-full border border-slate-200 dark:border-slate-800 space-y-4 animate-in zoom-in-95 duration-150">
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">Add Emergency Contact</h3>
            <form onSubmit={handleAddContact} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-500 font-bold mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={newContact.name}
                  onChange={(e) => setNewContact({ ...newContact, name: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 font-medium"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-500 font-bold mb-1">Relationship</label>
                  <select
                    value={newContact.relationship}
                    onChange={(e) => setNewContact({ ...newContact, relationship: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 font-medium"
                  >
                    <option value="Spouse">Spouse</option>
                    <option value="Parent">Parent</option>
                    <option value="Sibling">Sibling</option>
                    <option value="Friend">Friend</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-500 font-bold mb-1">Priority</label>
                  <select
                    value={newContact.priority}
                    onChange={(e) => setNewContact({ ...newContact, priority: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 font-medium"
                  >
                    <option value="Primary">Primary</option>
                    <option value="Secondary">Secondary</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-slate-500 font-bold mb-1">Phone Number</label>
                <input
                  type="text"
                  required
                  value={newContact.phone}
                  onChange={(e) => setNewContact({ ...newContact, phone: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 font-medium"
                />
              </div>
              <div>
                <label className="block text-slate-500 font-bold mb-1">Email Address</label>
                <input
                  type="email"
                  value={newContact.email}
                  onChange={(e) => setNewContact({ ...newContact, email: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 font-medium"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setContactModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold"
                >
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 rounded-xl bg-indigo-600 text-white font-bold">
                  Save Contact
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Dependent Modal */}
      {dependentModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 max-w-md w-full border border-slate-200 dark:border-slate-800 space-y-4 animate-in zoom-in-95 duration-150">
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">Add Dependent</h3>
            <form onSubmit={handleAddDependent} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-500 font-bold mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={newDependent.name}
                  onChange={(e) => setNewDependent({ ...newDependent, name: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 font-medium"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-500 font-bold mb-1">Relationship</label>
                  <select
                    value={newDependent.relationship}
                    onChange={(e) => setNewDependent({ ...newDependent, relationship: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 font-medium"
                  >
                    <option value="Child">Child</option>
                    <option value="Spouse">Spouse</option>
                    <option value="Parent">Parent</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-500 font-bold mb-1">Date of Birth</label>
                  <input
                    type="date"
                    required
                    value={newDependent.dob}
                    onChange={(e) => setNewDependent({ ...newDependent, dob: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 font-medium"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setDependentModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold"
                >
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 rounded-xl bg-indigo-600 text-white font-bold">
                  Save Dependent
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
