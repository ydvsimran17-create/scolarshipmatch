import {
  CheckCircle2,
  Clock,
  AlertCircle,
  FileText,
  FileSpreadsheet,
  Image as ImageIcon,
} from 'lucide-react'
import { DOCUMENT_STATUSES } from '../../data/documentsData'

export default function DocumentStatusBadge({ status }) {
  switch (status) {
    case DOCUMENT_STATUSES.VERIFIED:
      return (
        <span className="doc-badge doc-badge-verified">
          <CheckCircle2 size={12} /> Verified
        </span>
      )
    case DOCUMENT_STATUSES.PENDING:
      return (
        <span className="doc-badge doc-badge-pending">
          <Clock size={12} /> Pending Verification
        </span>
      )
    case DOCUMENT_STATUSES.MISSING:
      return (
        <span className="doc-badge doc-badge-missing">
          <AlertCircle size={12} /> Missing Document
        </span>
      )
    default:
      return <span className="doc-badge">{status}</span>
  }
}

export function DocumentTypeIcon({ fileType }) {
  const type = (fileType || '').toUpperCase()
  if (type === 'PDF') {
    return <FileText size={16} className="file-type-icon pdf-icon" />
  }
  if (type === 'JPG' || type === 'JPEG' || type === 'PNG') {
    return <ImageIcon size={16} className="file-type-icon img-icon" />
  }
  return <FileSpreadsheet size={16} className="file-type-icon other-icon" />
}
