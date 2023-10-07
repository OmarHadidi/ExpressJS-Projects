## Workflow:

-   setup `config` directory
-   setup error handling
-   setup logging
-   setup auth (can be simple at the beginning)

## Notes:
### Joi
- `schema.validate()` doesn't throw, only returns the error in the form of `{value, error}`. **While** `schema.validateAsync()` resolves with value or rejects (if not catched throws) if there is an error
