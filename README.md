# Sprint 1: TypeScript CSV

### Task C: Proposing Enhancement

- #### Step 1: Brainstorm on your own.
    There being no consistent way to attach the field category to the field for each of the arrays, currently just the first of each parse is the columns.

    Currently, it does not understand what a string is and just simply places quotations around what ever it is given, ignoring qutoations and its uses.

    No errors and specifics at all.

    Perhaps some way to focus on the csv file's fields rather than each row being individual people. Perhaps a categorization by fields alone.

- #### Step 2: Use an LLM to help expand your perspective.
Chat History with ChatGPT

From Given Prompt:
    Delimiter flexibility: Not all CSVs use commas — some use semicolons (;), tabs (\t), or pipes (|). Support configurable delimiters.
    Quoted fields: Handle cases where fields contain commas, newlines, or quotes themselves (escaped as "" in RFC 4180).
    Line breaks: Some files use \r\n, others \n, or even mixed. Detect and normalize.
    Empty lines / trailing newlines: Decide whether they become empty rows or should be skipped.
    Leading/trailing whitespace: Trim or preserve based on user config.
    Escaped characters: Consider backslashes (\) as escape sequences (depends on CSV dialect).
    Variable column counts: Some rows may have fewer or more columns than the header. Decide whether to pad, truncate, or throw.
    Huge files: Memory-efficient streaming vs. reading the whole file at once.

    Improvements for Usability

    Configurable header handling:
        Option to use the first row as headers.
        Allow passing a custom list of headers.
        Allow skipping headers entirely.
    Row mapping:
        Return rows as arrays or objects keyed by headers.
        Allow custom row transformer functions (e.g., parse numbers/dates).
    Type inference:
        Optionally auto-detect number/boolean/date types.
        Or allow a schema (e.g., {age: "number", joinedAt: "date"}).
    Error handling:
        Graceful handling of malformed rows (skip, warn, throw).
        Collect parsing errors for logging.
    Streaming API:
        For large files, expose an async iterator so devs can for await...of rows without loading everything into memory.
    Async sources:
        Accept ReadableStream, Blob, or string input, not just filenames (useful for browser apps, Node APIs, and cloud functions).
    Export/serialization:
        Ability to write CSV back out with consistent escaping.
    Internationalization:
        Handle Unicode properly (e.g., UTF-8 BOM at start of file).
        Support locales where decimal separator is ,.

    Dev-Friendly Features

    Well-typed return values:
        Generics for object rows, e.g., CSVParser<Person>.
        Type narrowing when headers are known.
    Plugin/extension hooks:
        Before/after row parsing hooks.
        Validation hooks.
    Config presets:
        Provide “RFC 4180 strict” mode and “loose spreadsheet” mode.
    Clear error messages:
        Include row/column index in parsing errors.
    Good docs & examples:
        Show common usage (browser upload, Node CLI, stream pipeline).

Increased focus on the same prompt we were given:
    "I’m working on a CSV parser in TypeScript that currently accepts a filename as input and converts rows into strings or objects. What might be broken or underspecified in the functionality, in terms of the CSV specification? What could the function do better from the perspective of a caller? Think in terms of validation, error handling, what the caller might need to do with the function, etc."


    What might be broken or underspecified in terms of CSV spec

    Quoting & Escaping
        Proper CSV allows fields to be quoted with ".
        Quoted fields may contain commas, newlines, or escaped quotes ("" for ").
        If your parser just split(","), it will break on these.
        Example:
        "Smith, John",42,"New
        York"
    Line breaks
        Rows can end in \r\n (Windows), \n (Unix), or \r (classic Mac).
        A quoted field can legally contain line breaks, so splitting by line alone may break data.
    Empty values
        An empty string between commas (a,,b) vs. a quoted empty string (a,"",b) may need differentiation.
        Some dialects treat missing values differently from empty strings.
    Headers vs. no headers
        RFC 4180 specifies that CSV may or may not have a header row.
        If your parser always assumes a header row, it might misinterpret data.
    Character encoding
        CSVs are often UTF-8, but you’ll also find UTF-16, Latin-1, etc.
        If you assume UTF-8 without validation, you might misparse characters.
    Delimiter flexibility
        Not all "CSV" files are comma-separated — some use semicolons, tabs, or pipes (;, \t, |).
        Without configurability, your parser may fail silently.

    What could be improved from the caller’s perspective

    Validation & Error Handling
        If a row has a different number of fields than the header, what happens?
        Should the parser throw, return an error object, or pad/mask the row?
        Callers may want strict mode vs. forgiving mode.
    Streaming vs. in-memory
        Large CSV files can be hundreds of MB or more.
        A caller may not want the entire file loaded into memory — streaming rows (async iterator, Node.js stream) would be valuable.
    Typed output
        Right now you give "strings or objects," but often callers want:
            Type inference ("42" → number, "true" → boolean).
            Configurable coercion (e.g., dates).
        If left to callers, they’ll need to re-implement type handling every time.
    Error reporting granularity
        If parsing fails, callers benefit from:
            The exact line/column where it failed.
            The raw content of the problematic row.
    Configurable headers
        Options to:
            Use the first row as headers.
            Provide custom headers.
            Return data as arrays instead of objects.
    Skipping / filtering rows
        Callers may want to:
            Skip blank lines or comment lines (e.g., starting with #).
            Trim whitespace from unquoted values.
    Normalization helpers
        Trimming values, normalizing line endings, unifying encodings.
        Without this, callers may need to pre-process files themselves.
    Output format options
        Rows as arrays of strings.
        Rows as objects keyed by header.
        A whole table as Record<string, string>[], or stream them.

Prompt with a focus on the developer's struggles:
    I’m working on a CSV parser in TypeScript that currently accepts a filename as input and converts rows into strings or objects. If you were a developer using this CSV parser, what would frustrate you? What would you want it to do that it currently doesn’t?

    Potential Frustrations

        Tight coupling to filenames
            If the parser only accepts a filename, that’s limiting. I might want to feed it:
                a raw CSV string (already loaded in memory),
                a Buffer (from an HTTP upload),
                a ReadableStream (e.g. Node.js stream from S3).
        Blocking / synchronous parsing
            If it blocks while parsing large files, my app can freeze. I’d want async parsing or streaming row-by-row.
        Rigid row handling
            If it only gives me all rows at once, memory will explode with large files. Developers want streaming iteration (for await (const row of parser) { … }).
        Weak error handling
            What happens if a row has too many/few columns? Does it crash? Silently skip? Inconsistent behavior is frustrating.
        Lack of control over headers
            Sometimes I want headers from the file. Sometimes I want to provide my own (e.g., first row is junk). If it forces one behavior, that’s annoying.
        No support for custom delimiters / encodings
            CSVs aren’t always commas. They might be semicolons, tabs, pipes, or even non-UTF8 encoded. Being locked to just commas and UTF-8 is frustrating.
        Limited type safety
            If everything just comes out as strings, I’ll have to cast manually. For example, "42" should be a number, "true" should be boolean. Otherwise, parsing gets tedious.
        No easy way to filter/map
            If I just want certain rows or fields, do I need to parse the whole thing and filter manually? That could be wasteful.

    Features Developers Would Want
        Multiple input types: filename, string, Buffer, Stream.
        Async + streaming support: yield rows one by one instead of dumping everything in memory.
        Flexible header handling:
            Use first row as headers
            Provide custom headers
            Skip headers entirely
        Delimiter and quote options: commas, semicolons, tabs, custom escape characters.
        Robust error handling:
            Option to skip bad rows, log them, or throw
            Detailed error messages (row number, column mismatch, etc.)
        Type inference + schema validation:
            Convert "123" → number automatically if possible
            Allow a developer to provide a schema ({ id: number, name: string, active: boolean })
        Row filtering & transformation hooks:
            Allow passing a function like mapRow(row) or filterRow(row) so you can transform during parsing instead of after.
        Metadata output:
            Number of rows parsed
            Rows skipped due to errors
            File encoding/delimiter detection
        Streaming to objects or JSON:
            Instead of just arrays of strings, let me directly stream into JSON objects.
        Good DX (developer experience):
            TypeScript type definitions (generics for row type)
            Clear docs and examples



- #### Step 3: Propose enhancements in your project README file.

Include a list of the top 4 enhancements or edge cases you think are most valuable to explore in the next week’s sprint. Label them clearly by category (extensibility vs. functionality), and include whether they came from you, the LLM, or both. Describe these using the User Story format—see below for a definition. 
    

Functionality:
    Came from both me and LLM:
    1. As a user, I can input complex data of almost any format within the typings so that I can store all the information I need.
        - Quoted strings, commas in said strings, newline calls in the string: all could technically fit within being a single "string".

Extensibility

    Came from both me and LLM:
    2. As a fellow developer who uses this application, I can easily find out what I should have put and what went wrong when coding so that it is less infuriating when I am using this parser.
        - Error Code standardization so instead of just silently breaking, it tells me what is going wrong. Also, some sort of rigid notation tells me what I can and cannot mess with.

    Came from both me and LLM:
    3. As a user, I can filter the csv to look at specific fields separately such as names or ages, so that I can quickly find objects or rows that match my descriptions
        -The user can select one or more filter options from a list.
        -The search results update dynamically based on the selected filters.
        -Information is now stored with respect to certain fields rather by object.

    Came from LLM:
    4. As a user, I can care less about correct type input for my csv, so that I can more comfortably use the parser to analyse notes or other spreadsheets.      
        - Automatically seeing the types and converting them to the same data type.
        - Ex. seven -> 7 and August 3rd -> 8/3

Include your notes from above: what were your initial ideas, what did the LLM suggest, and how did the results differ by prompt? What resonated with you, and what didn’t? (3-5 sentences.) 

    My intial ideas were to have a way to attach field column titles to the arrays, fix the string issue with quotated words, have specific errors, and categorize the fields. The LLM suggested many more features and improvements, many of them I did not even think of. The results had a defined focus on the prompt, changing with the details of the words used and favoring sides based on them. What resonated with me was how much the AI thought of the parser as larger than a simple script but more like an application. It thought about configurable headers and changeable delimiters with a UI. What did not resonate with me was the odd specifics about RFC 4180 or character encoding in UTF-8 vs. UTF-16.


### Design Choices

### 1340 Supplement

- #### 1. Correctness

- #### 2. Random, On-Demand Generation

- #### 3. Overall experience, Bugs encountered and resolved
#### Errors/Bugs:
#### Tests:
#### How To…

#### Team members and contributions (include cs logins):

#### Collaborators (cslogins of anyone you worked with on this project and/or generative AI): 
#### Total estimated time it took to complete project:
#### Link to GitHub Repo:  
