/**
 * NSAI Plugin Entry Point
 *
 * "What can be said at all can be said clearly."
 * — Tractatus Logico-Philosophicus
 */

import { TractarianValidator } from './validation/validator';
import { FogbinderHandoffManager } from './fogbinder/handoff';
import type { AtomicCitation } from './types/atomic';

/**
 * Main NSAI Plugin Class
 */
export class NSAIPlugin {
  private validator: TractarianValidator;
  private handoffManager: FogbinderHandoffManager;

  constructor() {
    this.validator = new TractarianValidator();
    this.handoffManager = new FogbinderHandoffManager();
    console.log('[NSAI] Plugin initialized');
  }

  /**
   * Initialize plugin when Zotero loads
   */
  async initialize(): Promise<void> {
    console.log('[NSAI] Initializing Neurosymbolic Validation System');

    // Register menu items
    this.registerMenuItems();

    // Set up event listeners
    this.setupEventListeners();

    console.log('[NSAI] Ready for validation');
  }

  /**
   * Register Zotero menu items
   */
  private registerMenuItems(): void {
    // This would integrate with Zotero's menu system
    // For now, logging the intent
    console.log('[NSAI] Menu items would be registered here');
  }

  /**
   * Set up event listeners
   */
  private setupEventListeners(): void {
    console.log('[NSAI] Event listeners would be set up here');
  }

  /**
   * Validate selected citations in Zotero
   */
  async validateSelection(citations: AtomicCitation[]): Promise<void> {
    console.log(`[NSAI] Validating ${citations.length} citations...`);

    const results = this.validator.validateBatch(citations);

    // Create Fogbinder export
    const fogbinderExport = this.handoffManager.exportToFogbinder(results);

    console.log('[NSAI] Validation complete');
    console.log('[NSAI] Certainty summary:', {
      validated: fogbinderExport.payload.validatedCitations.length,
      uncertain: fogbinderExport.payload.invalidCitations.length,
      overallCertainty: fogbinderExport.payload.epistemicSummary.overallCertainty,
    });

    // Display results in UI
    await this.displayResults(results);

    // Optionally export to Fogbinder
    if (fogbinderExport.payload.uncertaintyRegions.length > 0) {
      console.log('[NSAI] Uncertainty regions detected. Consider Fogbinder exploration.');
    }
  }

  /**
   * Display validation results
   */
  private async displayResults(results: any[]): Promise<void> {
    // This would open the popup UI
    console.log('[NSAI] Displaying results in UI');
  }

  /**
   * Shut down plugin
   */
  async shutdown(): Promise<void> {
    console.log('[NSAI] Shutting down');
  }
}

// Initialize plugin
const nsaiPlugin = new NSAIPlugin();

// Export for module usage
export default nsaiPlugin;

// Auto-initialize if in browser context
if (typeof window !== 'undefined') {
  nsaiPlugin.initialize().catch(console.error);
}
