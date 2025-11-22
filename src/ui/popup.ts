/**
 * NSAI Popup UI Logic
 *
 * Handles the popup interface for displaying validation results
 */

import type { ValidationResult, ValidationState } from '../types/atomic';
import type { FogbinderPayload } from '../types/fogbinder-interface';

/**
 * Popup UI Controller
 */
class PopupController {
  private validatedCount = 0;
  private uncertainCount = 0;
  private certaintyScore = 0;
  private results: ValidationResult[] = [];
  private fogbinderPayload: FogbinderPayload | null = null;

  constructor() {
    this.initializeEventListeners();
    this.loadValidationData();
  }

  /**
   * Initialize event listeners
   */
  private initializeEventListeners(): void {
    // Validate button
    const validateBtn = document.getElementById('validate-btn');
    validateBtn?.addEventListener('click', () => this.handleValidate());

    // Settings button
    const settingsBtn = document.getElementById('settings-btn');
    settingsBtn?.addEventListener('click', () => this.handleSettings());

    // Export to Fogbinder button
    const exportBtn = document.getElementById('export-fogbinder');
    exportBtn?.addEventListener('click', () => this.handleExportToFogbinder());

    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => this.handleKeyboard(e));
  }

  /**
   * Load validation data from storage
   */
  private async loadValidationData(): Promise<void> {
    try {
      // In a real Zotero plugin, this would load from Zotero's storage
      // For now, show empty state
      this.updateUI();
    } catch (error) {
      console.error('[NSAI] Error loading validation data:', error);
      this.announceToScreenReader('Error loading validation data');
    }
  }

  /**
   * Handle validate button click
   */
  private async handleValidate(): Promise<void> {
    this.announceToScreenReader('Starting validation...');

    // TODO: Get selected citations from Zotero
    // For now, show a message
    console.log('[NSAI] Validate clicked');
    alert('Validation would run here. Connect to Zotero API to validate selected citations.');
  }

  /**
   * Handle settings button click
   */
  private handleSettings(): void {
    console.log('[NSAI] Settings clicked');
    alert('Settings panel would open here.');
  }

  /**
   * Handle export to Fogbinder
   */
  private async handleExportToFogbinder(): Promise<void> {
    if (!this.fogbinderPayload) {
      this.announceToScreenReader('No data to export');
      return;
    }

    try {
      // Export to JSON file
      const json = JSON.stringify(this.fogbinderPayload, null, 2);
      const blob = new Blob([json], { type: 'application/json' });
      const url = URL.createObjectURL(blob);

      const a = document.createElement('a');
      a.href = url;
      a.download = `nsai-export-${new Date().toISOString()}.json`;
      a.click();

      URL.revokeObjectURL(url);

      this.announceToScreenReader('Exported to Fogbinder successfully');
    } catch (error) {
      console.error('[NSAI] Export error:', error);
      this.announceToScreenReader('Error exporting data');
    }
  }

  /**
   * Handle keyboard shortcuts
   */
  private handleKeyboard(event: KeyboardEvent): void {
    // Cmd/Ctrl + V: Validate
    if ((event.metaKey || event.ctrlKey) && event.key === 'v') {
      event.preventDefault();
      this.handleValidate();
    }

    // Cmd/Ctrl + E: Export to Fogbinder
    if ((event.metaKey || event.ctrlKey) && event.key === 'e') {
      event.preventDefault();
      this.handleExportToFogbinder();
    }

    // Escape: Close popup
    if (event.key === 'Escape') {
      window.close();
    }
  }

  /**
   * Update UI with validation results
   */
  updateValidationResults(
    results: ValidationResult[],
    fogbinderPayload: FogbinderPayload
  ): void {
    this.results = results;
    this.fogbinderPayload = fogbinderPayload;

    this.validatedCount = fogbinderPayload.validatedCitations.length;
    this.uncertainCount = fogbinderPayload.invalidCitations.length;
    this.certaintyScore = fogbinderPayload.epistemicSummary.overallCertainty;

    this.updateUI();
    this.announceToScreenReader(
      `Validation complete. ${this.validatedCount} validated, ${this.uncertainCount} uncertain. Overall certainty: ${Math.round(this.certaintyScore * 100)}%`
    );
  }

  /**
   * Update all UI elements
   */
  private updateUI(): void {
    this.updateStatusCard();
    this.updateCertaintyMeter();
    this.updateResultsList();
    this.updateFogbinderSection();
  }

  /**
   * Update status card
   */
  private updateStatusCard(): void {
    const validatedEl = document.getElementById('validated-count');
    const uncertainEl = document.getElementById('uncertain-count');
    const certaintyEl = document.getElementById('certainty-score');

    if (validatedEl) {
      validatedEl.textContent = this.validatedCount.toString();
    }

    if (uncertainEl) {
      uncertainEl.textContent = this.uncertainCount.toString();
    }

    if (certaintyEl) {
      const percentage = Math.round(this.certaintyScore * 100);
      certaintyEl.textContent = `${percentage}%`;
    }
  }

  /**
   * Update certainty meter
   */
  private updateCertaintyMeter(): void {
    const meterFill = document.getElementById('certainty-meter-fill');
    const meterBar = meterFill?.parentElement;

    if (meterFill && meterBar) {
      const percentage = Math.round(this.certaintyScore * 100);
      meterFill.style.width = `${percentage}%`;
      meterBar.setAttribute('aria-valuenow', percentage.toString());
    }
  }

  /**
   * Update results list
   */
  private updateResultsList(): void {
    const resultsList = document.getElementById('results-list');
    if (!resultsList) return;

    if (this.results.length === 0) {
      resultsList.innerHTML = '<p class="results-empty">No validation data available.</p>';
      return;
    }

    resultsList.innerHTML = '';

    for (const result of this.results) {
      const item = this.createResultItem(result);
      resultsList.appendChild(item);
    }
  }

  /**
   * Create a result item element
   */
  private createResultItem(result: ValidationResult): HTMLElement {
    const item = document.createElement('div');
    item.className = `result-item ${this.getStateClass(result.state)}`;
    item.setAttribute('role', 'listitem');

    const title = document.createElement('div');
    title.className = 'result-title';
    title.textContent = result.citation.title;

    const meta = document.createElement('div');
    meta.className = 'result-meta';
    const authors = result.citation.creators
      .map(c => `${c.firstName || ''} ${c.lastName}`.trim())
      .join(', ');
    meta.textContent = `${authors} (${result.citation.date || 'n.d.'})`;

    const certainty = document.createElement('div');
    certainty.className = 'result-certainty';
    const score = Math.round(result.certainty.score * 100);
    certainty.textContent = `Certainty: ${score}% — ${result.certainty.reasoning}`;

    item.appendChild(title);
    item.appendChild(meta);
    item.appendChild(certainty);

    // Add issues if any
    if (result.issues.length > 0) {
      const issuesList = document.createElement('ul');
      issuesList.style.marginTop = '0.5rem';
      issuesList.style.fontSize = '0.75rem';
      issuesList.style.color = 'var(--gray-300)';

      for (const issue of result.issues.slice(0, 3)) {  // Show max 3
        const issueItem = document.createElement('li');
        issueItem.textContent = `${issue.severity}: ${issue.message}`;
        issuesList.appendChild(issueItem);
      }

      item.appendChild(issuesList);
    }

    return item;
  }

  /**
   * Get CSS class for validation state
   */
  private getStateClass(state: ValidationState): string {
    switch (state) {
      case 'VALID':
        return 'valid';
      case 'UNCERTAIN':
        return 'uncertain';
      case 'INCOMPLETE':
      case 'INCONSISTENT':
        return 'error';
      default:
        return '';
    }
  }

  /**
   * Update Fogbinder section
   */
  private updateFogbinderSection(): void {
    const section = document.getElementById('fogbinder-section');
    const countEl = document.getElementById('uncertainty-count');

    if (!section || !this.fogbinderPayload) return;

    const uncertaintyCount = this.fogbinderPayload.uncertaintyRegions.length;

    if (uncertaintyCount > 0) {
      section.hidden = false;
      if (countEl) {
        countEl.textContent = uncertaintyCount.toString();
      }
    } else {
      section.hidden = true;
    }
  }

  /**
   * Announce to screen reader
   */
  private announceToScreenReader(message: string): void {
    const announcer = document.getElementById('sr-announcements');
    if (announcer) {
      announcer.textContent = message;
      // Clear after announcement
      setTimeout(() => {
        announcer.textContent = '';
      }, 1000);
    }
  }
}

// Initialize popup when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    new PopupController();
  });
} else {
  new PopupController();
}

export default PopupController;
