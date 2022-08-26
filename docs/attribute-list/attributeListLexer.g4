lexer grammar attributeListLexer;

Separator: ',';
AttributeName: [\p{Letter}\p{Mark}\p{Number}\p{Connector_Punctuation} ] ([\p{Letter}\p{Mark}\p{Number}\p{Connector_Punctuation} ] | '-')*;
AttributeNameWithValue: AttributeName '=' AttributeValue? -> mode(UNTIL_NEXT_ATTRIBUTE_MODE);
PositionalAttributeValue: (~[\p{Letter}\p{Mark}\p{Number}\p{Connector_Punctuation},] ~(',')* | [\p{Letter}\p{Mark}\p{Number}\p{Connector_Punctuation}] ~(',')+) -> mode(UNTIL_NEXT_ATTRIBUTE_MODE);

AttributeValue
: DoubleQuotedStr
| SingleQuotedStr
| Str
;

fragment
DoubleQuotedStr: '"' (~('"' | '\\' | '\r' | '\n') | '\\' ('"' | '\\'))+ '"';
fragment
SingleQuotedStr: '\'' (~('\'' | '\\' | '\r' | '\n') | '\\' ('\'' | '\\'))+ '\'';
fragment
Str: ~(',')+;

mode UNTIL_NEXT_ATTRIBUTE_MODE;
Next : ',' -> mode(DEFAULT_MODE);
