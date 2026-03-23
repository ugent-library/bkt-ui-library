 # JavaScript Architecture

The Booktower UI Library uses vanilla JavaScript with custom events for component communication. No framework dependencies.

## Core Principles

- **Progressive Enhancement**: All interactions work without JavaScript
- **Event-Driven**: Components communicate via custom events
- **Modular**: Each script handles one concern
- **Prototype-Ready**: Stub data allows testing before real APIs

## Event System

Components dispatch and listen for custom events:

```javascript
// Dispatch an event
document.dispatchEvent(new CustomEvent('biblio:filter-add', {
  detail: {
    filterId: 'author',
    displayValue: 'John Doe',
    rawValue: 'john-doe-id'
  }
}));

// Listen for events
document.addEventListener('biblio:filter-add', e => {
  const { filterId, displayValue, rawValue } = e.detail;
  // Handle filter addition
});
```

## Key Events

- `biblio:filter-add` — Add a filter chip (from autocomplete, filter editor)
- `people-search:select` — Person selected from people widget
- `htmx:afterSwap` — HTMX content updates (used for panel visibility)

## Script Loading Order

Scripts must load in dependency order:

```html
<!-- Core dependencies -->
<script src="/assets/js/people-search.js"></script>
<script src="/assets/js/people-search-stub.js"></script>  <!-- Remove when real API exists -->
<script src="/assets/js/filter-editor.js"></script>

<!-- Feature-specific -->
<script src="/assets/js/filter-stubs.js"></script>       <!-- Remove when real APIs exist -->
<script src="/assets/js/suggest-panel.js"></script>
```

## Component Scripts

### filter-editor.js
Manages filter chips and the filter editor modal.

- Creates/removes chips in `#active-chips`
- Opens editor modal for filter types
- Handles people search integration
- Dispatches `biblio:filter-add` on apply

### suggest-panel.js
Controls autocomplete panel behavior.

- Shows/hides panel on input focus/keyup
- Keyboard navigation (arrows, enter, escape)
- Dispatches `biblio:filter-add` for org/project/keyword selections
- Integrates with HTMX for content updates

### filter-stubs.js (Prototype)
Provides autocomplete suggestions for text filter fields.

- Intercepts input events on `#text-val`
- Shows inline suggestion list below input
- Uses local stub data arrays
- **Remove when real server endpoints exist**

### people-search.js
People selection widget used in filter editor.

- Renders federated search interface
- Dispatches `people-search:select` on selection
- Integrates with filter editor modal

## HTMX Integration

The library uses HTMX for dynamic content updates:

- Search suggestions: `hx-get="/search/suggest"`
- Filter updates: `hx-get="/search"` with parameters
- Form submissions: `hx-post="/filter/apply"`

Scripts listen for `htmx:afterSwap` to update UI state after content changes.

## Prototype vs Production

Several scripts contain prototype code to be removed:

- `people-search-stub.js` — Mock people data
- `filter-stubs.js` — Mock autocomplete data
- Inline HTMX attributes with stub URLs

## Testing

JavaScript is tested through:
- Template integration (scripts loaded in HTML)
- Event dispatching/listening
- Prototype data for development
- Progressive enhancement (works without JS)

## Future Considerations

- Consider bundling for production
- Add error handling for failed requests
- Implement loading states for async operations
- Add analytics tracking for user interactions