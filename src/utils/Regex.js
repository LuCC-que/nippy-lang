const Spec = [
  /*------------------------
    empty case
   */
  [/^\s+/, null],

  /*------------------------
    NUMBER case
   */
  [/^\d+/, "NUMBER"],

  /*------------------------
    Singlie-line comments case
   */
  [/^\/\/.*/, null],

  /*------------------------
    double-line comments case
   */
  [/^\/\*[\s\S]*?\*\//, null],

  /*------------------------
    STRING case
   */
  [/^"[^"]*"/, "STRING"],

  /*------------------------
    STRING case
   */
  [/^'[^']*'/, "STRING"],

  //--------symbols---------
  /*------------------------
    ; case
   */
  [/^;/, ";"],
  /*------------------------
    { case
   */
  [/^\{/, "{"],
  /*------------------------
    } case
   */
  [/^\}/, "}"],
  /*------------------------
    ( case
   */
  [/^\(/, "("],
  /*------------------------
    ) case
   */
  [/^\)/, ")"],
  /*------------------------
     , case
   */
  [/^,/, ","],
  /*------------------------
     . case
   */
  [/^\./, "."],

  /*------------------------
     [ case
   */
  [/^\[/, "["],

  /*------------------------
     ] case
   */
  [/^\]/, "]"],

  /*------------------------
    Keywords
   */
  [/^\blet\b/, "let"],
  [/^\bif\b/, "if"],
  [/^\belse\b/, "else"],
  [/^\belif\b/, "elif"],
  [/^\belse\sif\b/, "elif"],
  [/^\btrue\b/, "true"],
  [/^\bfalse\b/, "false"],
  [/^\bnull\b/, "null"],
  [/^\bwhile\b/, "while"],
  [/^\bdo\b/, "do"],
  [/^\bfor\b/, "for"],
  [/^\bdef\b/, "def"],
  [/^\breturn\b/, "return"],
  [/^\bclass\b/, "class"],
  [/^\bextends\b/, "extends"],
  [/^\bsuper\b/, "super"],
  [/^\bthis\b/, "this"],
  [/^\bnew\b/, "new"],
  [/^\blambda\b/, "Lambda"],
  [/^\bLambda\b/, "Lambda"],
  [/^\bList\b/, "List"],
  [/^\blist\b/, "List"],

  /*------------------------
    Identifiers case
   */
  [/^\w+/, "IDENTIFIER"],

  /*------------------------
    EQUALITY_OPERATOR ntifiers case
   */
  [/^[=!]=/, "EQUALITY_OPERATOR"],

  /*------------------------
    Assignment cases
    = += /= += -=
   */
  [/^\=/, "SIMPLE_ASSIGN"],
  [/^[\*\/\+\-]=/, "COMPLEX_ASSIGN"],

  /*------------------------
    Relational cases
    >, >=, <, <=
   */
  [/^[><]=?/, "RELATIONAL_OPERATOR"],
  /*------------------------
    Logical cases
    &&, \\, !
   */
  [/^&&/, "LOGICAL_AND"],
  [/^\|\|/, "LOGICAL_OR"],

  //unary case, lowest precedent
  [/^!/, "LOGICAL_NOT"],
  [/^\+\+/, "++"],
  [/^\-\-/, "--"],

  //--------Operators---------
  [/^[+\-]/, "ADDITIVE_OPERATOR"],
  [/^[*\/]/, "MULTIPLICATIVE_OPERATOR"],
];

module.exports = Spec;
