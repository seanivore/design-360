# Create Project Portfolio Entries 

## Process 



```css
@media (min-width: 48rem) {
    .tag-filter {
        font-size: 2rem;
    }
}

.tag-filter {
    flex-shrink: 0;
    padding: 0;
    background: none;
    border: none;
    font-family: 'Agency FB', -apple-system-ui-monospace, ui-monospace, 'SF Mono', Menlo, Monaco, 'Cascadia Code', 'Roboto Mono', monospace;
    font-size: 2rem; /* UPDATE */
    letter-spacing: 0.02em; /* REMOVE */
    font-weight: var(--font-weight-heavy); /* REMOVE */
}

.tag-filters-container {
    margin-left: calc(-0.8 * var(--space-md));
    margin-right: calc(-0.8 * var(--space-md));
}

.tag-filters-wrapper {
    padding: var(--space-sm) 0.125rem; /* REMOVE */
}

.tag-filters-container::before, .tag-filters-container::after {
    width: 8rem;
}

```