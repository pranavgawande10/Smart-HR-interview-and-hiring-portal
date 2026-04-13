import React from 'react'

function StatusBadge({ status }) {
  const colors = {
    hired: '#16a34a',
    pending: '#f59e0b',
    rejected: '#dc2626',
    interview: '#2563eb',
  }

  return (
    <span
      style={{
        padding: '5px 12px',
        borderRadius: '999px',
        fontSize: '12px',
        fontWeight: '600',
        color: '#fff',
        backgroundColor: colors[status] || '#6b7280',
        animation: 'fadeIn 0.4s ease',
      }}
    >
      {status}
    </span>
  )
}

export default StatusBadge
