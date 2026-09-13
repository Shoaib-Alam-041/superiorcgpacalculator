# Fix calculator labels

## Changes
- Keep the descriptive homepage H1 already in place.
- Preserve the completed SGPA row labels and accessible selection names.
- Add unique IDs to every CGPA semester label, SGPA, and credits field.
- Connect each CGPA label to its field with `htmlFor`.
- Verify the page builds and the rendered controls expose clear accessible names.
- Mark the SEO finding fixed after all checks pass.

## Technical details
- IDs will include each row's stable semester ID to prevent duplicates when rows are added or removed.
- Existing calculator behavior and styling will remain unchanged.
