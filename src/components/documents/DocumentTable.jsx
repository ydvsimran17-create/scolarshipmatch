import {
  Calendar,
  Eye,
  Trash2,
  Upload,
  ShieldAlert,
} from 'lucide-react'
import DocumentStatusBadge, { DocumentTypeIcon } from './DocumentStatusBadge'
import { DOCUMENT_STATUSES } from '../../data/documentsData'
import './DocumentTable.css'

export default function DocumentTable({
  documents = [],
  onPreview,
  onDeletePrompt,
  onQuickUploadForMissing,
}) {
  return (
    <div className="document-table-card card">
      <div className="table-responsive-wrapper">
        <table className="documents-tracking-table" aria-label="Student documents list">
          <thead>
            <tr>
              <th scope="col" className="th-doc-name">Document Name</th>
              <th scope="col" className="th-doc-cat">Category</th>
              <th scope="col" className="th-doc-date">Upload Date</th>
              <th scope="col" className="th-doc-type">Type &amp; Size</th>
              <th scope="col" className="th-doc-status">Verification Status</th>
              <th scope="col" className="th-doc-actions text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {documents.map((doc) => {
              const isMissing = doc.status === DOCUMENT_STATUSES.MISSING

              return (
                <tr key={doc.id} className={`doc-table-row ${isMissing ? 'row-missing' : ''}`}>
                  {/* Name and Metadata */}
                  <td className="td-doc-name">
                    <div className="doc-name-cell-wrap">
                      <div className="doc-icon-container">
                        <DocumentTypeIcon fileType={doc.fileType} />
                      </div>
                      <div className="doc-text-meta">
                        <span className="doc-item-title font-semibold text-sm">
                          {doc.name}
                        </span>
                        <span className="doc-authority-hint text-xs text-secondary">
                          {doc.verifiedBy || doc.description}
                        </span>
                        {doc.isDemo && (
                          <span className="doc-demo-tag text-xs text-muted">
                            <ShieldAlert size={10} className="inline-icon" /> Demo Record
                          </span>
                        )}
                      </div>
                    </div>
                  </td>

                  {/* Category */}
                  <td className="td-doc-cat">
                    <span className="badge badge-linen text-xs">
                      {doc.category}
                    </span>
                  </td>

                  {/* Upload Date */}
                  <td className="td-doc-date">
                    <div className="doc-date-cell">
                      <Calendar size={13} className="date-icon" />
                      <span className="text-xs">{doc.uploadDate || '—'}</span>
                    </div>
                  </td>

                  {/* Type and Size */}
                  <td className="td-doc-type">
                    <div className="doc-type-pill-wrap">
                      <span className="file-format-badge font-mono text-xs">
                        {doc.fileType || '—'}
                      </span>
                      <span className="file-size-text text-xs text-muted">
                        {doc.fileSize || '—'}
                      </span>
                    </div>
                  </td>

                  {/* Verification Status */}
                  <td className="td-doc-status">
                    <DocumentStatusBadge status={doc.status} />
                  </td>

                  {/* Actions */}
                  <td className="td-doc-actions text-right">
                    <div className="actions-button-cluster">
                      {!isMissing ? (
                        <>
                          <button
                            type="button"
                            className="btn btn-outline btn-sm action-btn preview-btn"
                            onClick={() => onPreview(doc)}
                            title={`Preview ${doc.name}`}
                          >
                            <Eye size={14} /> <span>Preview</span>
                          </button>

                          <button
                            type="button"
                            className="btn btn-ghost btn-sm action-btn delete-btn"
                            onClick={() => onDeletePrompt(doc)}
                            title={`Delete ${doc.name}`}
                          >
                            <Trash2 size={14} />
                          </button>
                        </>
                      ) : (
                        <button
                          type="button"
                          className="btn btn-primary btn-sm action-btn upload-now-btn"
                          onClick={() => onQuickUploadForMissing(doc)}
                          title={`Upload file for ${doc.name}`}
                        >
                          <Upload size={13} /> <span>Upload Now</span>
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Table Footer Note */}
      <div className="doc-table-footer">
        <span className="text-xs text-muted">
          <ShieldAlert size={13} className="footer-demo-icon" /> Initial sample documents are simulated demo records. Files you upload during this session can be previewed directly in your browser.
        </span>
      </div>
    </div>
  )
}
