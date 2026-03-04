/**
 * Symptom Selector Component
 * 
 * Provides a searchable multi-select interface for symptom selection.
 * Features:
 * - Search/filter symptoms by typing
 * - Multi-select with visual feedback
 * - Display selected symptoms as removable tags
 */

import { useState } from 'react'

function SymptomSelector({ symptoms, selectedSymptoms, onSymptomChange }) {
  const [searchTerm, setSearchTerm] = useState('')
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)

  /**
   * Filter symptoms based on search term
   * Case-insensitive search through symptom names
   */
  const filteredSymptoms = symptoms.filter(symptom =>
    symptom.toLowerCase().includes(searchTerm.toLowerCase()) &&
    !selectedSymptoms.includes(symptom)
  )

  /**
   * Add symptom to selection
   */
  const handleSelectSymptom = (symptom) => {
    onSymptomChange([...selectedSymptoms, symptom])
    setSearchTerm('')
    setIsDropdownOpen(false)
  }

  /**
   * Remove symptom from selection
   */
  const handleRemoveSymptom = (symptom) => {
    onSymptomChange(selectedSymptoms.filter(s => s !== symptom))
  }

  return (
    <div className="space-y-4">
      {/* Search Input */}
      <div className="relative">
        <input
          type="text"
          placeholder="Search symptoms..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value)
            setIsDropdownOpen(true)
          }}
          onFocus={() => setIsDropdownOpen(true)}
          className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-medical-primary 
                   focus:outline-none transition-colors"
        />

        {/* Dropdown List */}
        {isDropdownOpen && searchTerm && filteredSymptoms.length > 0 && (
          <div className="absolute z-10 w-full mt-2 bg-white border-2 border-gray-200 rounded-lg 
                        shadow-lg max-h-60 overflow-y-auto">
            {filteredSymptoms.slice(0, 10).map((symptom) => (
              <button
                key={symptom}
                onClick={() => handleSelectSymptom(symptom)}
                className="w-full text-left px-4 py-3 hover:bg-medical-light transition-colors
                         border-b border-gray-100 last:border-b-0"
              >
                {symptom}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Selected Symptoms Display */}
      {selectedSymptoms.length > 0 && (
        <div>
          <p className="text-sm font-medium text-gray-700 mb-2">
            Selected Symptoms ({selectedSymptoms.length}):
          </p>
          <div className="flex flex-wrap gap-2">
            {selectedSymptoms.map((symptom) => (
              <span
                key={symptom}
                className="inline-flex items-center gap-2 bg-medical-primary text-white 
                         px-3 py-1 rounded-full text-sm"
              >
                {symptom}
                <button
                  onClick={() => handleRemoveSymptom(symptom)}
                  className="hover:bg-medical-dark rounded-full p-1 transition-colors"
                >
                  ✕
                </button>
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default SymptomSelector
