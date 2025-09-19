import React, { useEffect, useState } from 'react';
import api from '../api';
import LeadForm from '../components/LeadForm';

export default function Leads() {
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [q, setQ] = useState('');
  const [editing, setEditing] = useState(null);

  async function fetchLeads(p = page) {
    setLoading(true);
    try {
      const res = await api.get('/leads', { params: { page: p, limit, q }});
      setData(res.data.data);
      setPage(res.data.page);
      setTotalPages(res.data.totalPages);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { fetchLeads(1); }, [limit]);

  function onSearch(e) {
    e.preventDefault();
    fetchLeads(1);
  }

  async function deleteLead(id) {
    if (!confirm('Delete lead?')) return;
    try {
      await api.delete('/leads/' + id);
      fetchLeads(page);
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div style={{padding:20}}>
      <h1>Leads</h1>
      <div style={{display:'flex', gap:10, marginBottom:10}}>
        <form onSubmit={onSearch}>
          <input placeholder="search name/company/email" value={q} onChange={e=>setQ(e.target.value)} />
          <button type="submit">Search</button>
        </form>
        <button onClick={() => setEditing({})}>+ New Lead</button>
        <button onClick={() => { api.post('/auth/logout').then(()=>window.location.href='/login') }}>Logout</button>
      </div>

      <LeadForm onSaved={() => { setEditing(null); fetchLeads(1); }} editing={editing} onClose={() => setEditing(null)} />

      {loading ? <div>Loading...</div> : (
        <>
          <table className="leads-table">
            <thead>
              <tr>
                <th>Name</th><th>Email</th><th>Company</th><th>Source</th><th>Status</th><th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {data.map(l => (
                <tr key={l.id}>
                  <td>{l.first_name} {l.last_name}</td>
                  <td>{l.email}</td>
                  <td>{l.company}</td>
                  <td>{l.source}</td>
                  <td>{l.status}</td>
                  <td>
                    <button onClick={() => setEditing(l)}>Edit</button>
                    <button onClick={() => deleteLead(l.id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div style={{marginTop:10}}>
            <button onClick={() => fetchLeads(Math.max(1, page-1))} disabled={page<=1}>Prev</button>
            <span style={{margin: '0 10px'}}>Page {page} / {totalPages}</span>
            <button onClick={() => fetchLeads(Math.min(totalPages, page+1))} disabled={page>=totalPages}>Next</button>
            <select value={limit} onChange={e=>setLimit(parseInt(e.target.value))} style={{marginLeft:10}}>
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
            </select>
          </div>
        </>
      )}
    </div>
  );
}
