import React, { useEffect, useState } from 'react';
import api from '../api';

const blank = {
  first_name: '', last_name: '', email: '', phone:'', company:'', city:'', state:'', source:'website', status:'new', score: 0, lead_value: 0, is_qualified: false
};

export default function LeadForm({ editing, onSaved, onClose }) {
  const [form, setForm] = useState(blank);
  useEffect(() => {
    if (editing) setForm(editing.id ? editing : blank);
    else setForm(blank);
  }, [editing]);

  async function submit(e) {
    e.preventDefault();
    try {
      if (form.id) {
        await api.put('/leads/' + form.id, form);
      } else {
        await api.post('/leads', form);
      }
      onSaved && onSaved();
    } catch (err) {
      console.error(err);
      alert('Save failed');
    }
  }

  if (!editing) return null;

  return (
    <div className="modal">
      <form className="card" onSubmit={submit}>
        <h3>{form.id ? 'Edit Lead' : 'New Lead'}</h3>
        <label>First name</label>
        <input value={form.first_name} onChange={e=>setForm({...form, first_name: e.target.value})} />
        <label>Last name</label>
        <input value={form.last_name} onChange={e=>setForm({...form, last_name: e.target.value})} />
        <label>Email</label>
        <input value={form.email} onChange={e=>setForm({...form, email: e.target.value})} />
        <label>Company</label>
        <input value={form.company} onChange={e=>setForm({...form, company: e.target.value})} />
        <label>Source</label>
        <select value={form.source} onChange={e=>setForm({...form, source: e.target.value})}>
          <option value="website">website</option>
          <option value="facebook_ads">facebook_ads</option>
          <option value="google_ads">google_ads</option>
          <option value="referral">referral</option>
          <option value="events">events</option>
          <option value="other">other</option>
        </select>
        <label>Status</label>
        <select value={form.status} onChange={e=>setForm({...form, status: e.target.value})}>
          <option value="new">new</option>
          <option value="contacted">contacted</option>
          <option value="qualified">qualified</option>
          <option value="lost">lost</option>
          <option value="won">won</option>
        </select>

        <div style={{display:'flex', gap:10, marginTop:10}}>
          <button type="submit">{form.id ? 'Save' : 'Create'}</button>
          <button type="button" onClick={() => onClose && onClose()}>Cancel</button>
        </div>
      </form>
    </div>
  );
}
