import { useState, useMemo, useEffect } from 'react'
import {
  FolderOpen,
  Upload,
  ShieldAlert,
  Sparkles,
  RotateCcw,
} from 'lucide-react'
import { initialDocuments, DOCUMENT_CATEGORIES } from '../data/documentsData'
import DocumentOverviewCards from '../components/documents/DocumentOverviewCards'
import DocumentCategoryTabs from '../components/documents/DocumentCategoryTabs'
import DocumentTable from '../components/documents/DocumentTable'
import DocumentChecklistCard from '../components/documents/DocumentChecklistCard'
import DocumentUploadModal from '../components/documents/DocumentUploadModal'
import DocumentPreviewModal from '../components/documents/DocumentPreviewModal'
import DeleteConfirmModal from '../components/documents/DeleteConfirmModal'
import DocumentEmptyState from '../components/documents/DocumentEmptyState'
import './Documents.css'

export default function Documents() {
  const storageKey = 'scholarship_documents_list'

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])

  // Persistent documents state in localStorage with demo fallback
  const [documents, setDocuments] = useState(() => {
    try {
      const saved = localStorage.getItem(storageKey)
      return saved ? JSON.parse(saved) : initialDocuments
    } catch {
      return initialDocuments
    }
  })

  // Synchronize documents with localStorage
  useEffect(() => {
    try {
      // Clean previewUrl before saving to localStorage because object URLs cannot be stringified safely
      const serializableDocs = documents.map((doc) => {
        if (doc.previewUrl) {
          const docCopy = { ...doc }
          delete docCopy.previewUrl
          return docCopy
        }
        return doc
      })
      localStorage.setItem(storageKey, JSON.stringify(serializableDocs))
    } catch {
      // storage fallback
    }
  }, [documents])

  // Filter and Search State
  const [activeCategory, setActiveCategory] = useState('All Documents')
  const [statusFilter, setStatusFilter] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')

  // Modals state
  const [isUploadOpen, setIsUploadOpen] = useState(false)
  const [prefillDocForUpload, setPrefillDocForUpload] = useState(null)
  const [previewingDoc, setPreviewingDoc] = useState(null)
  const [deletingDoc, setDeletingDoc] = useState(null)

  // Filtered documents calculation
  const filteredDocuments = useMemo(() => {
    return documents.filter((doc) => {
      // Search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim()
        const nameMatches = doc.name.toLowerCase().includes(q)
        const catMatches = doc.category.toLowerCase().includes(q)
        const authMatches = (doc.verifiedBy || '').toLowerCase().includes(q)
        if (!nameMatches && !catMatches && !authMatches) return false
      }

      // Category filter
      if (activeCategory !== 'All Documents' && doc.category !== activeCategory) {
        return false
      }

      // Status filter
      if (statusFilter !== 'All' && doc.status !== statusFilter) {
        return false
      }

      return true
    })
  }, [documents, searchQuery, activeCategory, statusFilter])

  // Handlers
  const handleClearFilters = () => {
    setActiveCategory('All Documents')
    setStatusFilter('All')
    setSearchQuery('')
  }

  const handleOpenUploadNew = () => {
    setPrefillDocForUpload(null)
    setIsUploadOpen(true)
  }

  const handleQuickUploadForMissing = (doc) => {
    setPrefillDocForUpload(doc)
    setIsUploadOpen(true)
  }

  const handleUploadSuccess = (newDoc) => {
    setDocuments((prev) => {
      // If replacing a missing document
      const existingIndex = prev.findIndex((d) => d.id === newDoc.id)
      if (existingIndex !== -1) {
        const next = [...prev]
        next[existingIndex] = newDoc
        return next
      }
      return [newDoc, ...prev]
    })
  }

  const handleConfirmDelete = (id) => {
    setDocuments((prev) => prev.filter((d) => d.id !== id))
    setDeletingDoc(null)
  }

  const handleResetToDemo = () => {
    if (window.confirm('Reset all document records to original sample demo data?')) {
      setDocuments(initialDocuments)
      try {
        localStorage.setItem(storageKey, JSON.stringify(initialDocuments))
      } catch {
        // storage fallback
      }
    }
  }

  const isFiltered =
    Boolean(searchQuery) ||
    activeCategory !== 'All Documents' ||
    statusFilter !== 'All'

  return (
    <div className="documents-page-container">
      {/* 1. Page Header with Prominent Upload Action */}
      <header className="documents-header card">
        <div className="header-info-cluster">
          <div className="header-badges-row">
            <span className="badge badge-indigo">
              <FolderOpen size={13} /> Documents Management
            </span>
            <span className="badge badge-currant">
              <ShieldAlert size={12} /> Demo Data
            </span>
            <span className="badge badge-brass">
              <Sparkles size={12} /> Anvaya Sharma (AS)
            </span>
          </div>

          <h1 className="documents-page-heading">My Documents</h1>

          <p className="documents-page-subtitle text-secondary">
            Organize and manage the documents required for your scholarship applications, verify institutional authentication status, and upload newly requested certificates.
          </p>
        </div>

        <div className="header-actions-cluster">
          <button
            type="button"
            className="btn btn-primary btn-upload-prominent"
            onClick={handleOpenUploadNew}
          >
            <Upload size={16} /> Upload Document
          </button>

          <button
            type="button"
            className="btn btn-outline btn-sm reset-demo-btn"
            onClick={handleResetToDemo}
            title="Reset documents to demo defaults"
          >
            <RotateCcw size={13} /> Reset Demo Records
          </button>
        </div>
      </header>

      {/* 2. Document Overview Cards (4 summary cards) */}
      <DocumentOverviewCards
        documents={documents}
        activeStatusFilter={statusFilter}
        onSelectStatusFilter={(st) => setStatusFilter(st)}
      />

      {/* 3. Document Category Tabs & Search/Status Filter Bar */}
      <DocumentCategoryTabs
        categories={DOCUMENT_CATEGORIES}
        activeCategory={activeCategory}
        onSelectCategory={setActiveCategory}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
        onClearFilters={handleClearFilters}
        totalMatching={filteredDocuments.length}
      />

      {/* 4. Documents Table or Empty State */}
      {filteredDocuments.length > 0 ? (
        <DocumentTable
          documents={filteredDocuments}
          onPreview={(doc) => setPreviewingDoc(doc)}
          onDeletePrompt={(doc) => setDeletingDoc(doc)}
          onQuickUploadForMissing={handleQuickUploadForMissing}
        />
      ) : (
        <DocumentEmptyState
          isFiltered={isFiltered}
          onClearFilters={handleClearFilters}
          onOpenUpload={handleOpenUploadNew}
        />
      )}

      {/* 5. Standard Scholarship Document Checklist */}
      <DocumentChecklistCard />

      {/* 6. Upload Modal */}
      <DocumentUploadModal
        key={`${prefillDocForUpload?.id || 'new'}-${isUploadOpen}`}
        isOpen={isUploadOpen}
        onClose={() => {
          setIsUploadOpen(false)
          setPrefillDocForUpload(null)
        }}
        onUploadSuccess={handleUploadSuccess}
        prefillDoc={prefillDocForUpload}
      />

      {/* 7. Preview Modal */}
      <DocumentPreviewModal
        document={previewingDoc}
        isOpen={Boolean(previewingDoc)}
        onClose={() => setPreviewingDoc(null)}
      />

      {/* 8. Delete Confirmation Modal */}
      <DeleteConfirmModal
        document={deletingDoc}
        isOpen={Boolean(deletingDoc)}
        onClose={() => setDeletingDoc(null)}
        onConfirmDelete={handleConfirmDelete}
      />
    </div>
  )
}
