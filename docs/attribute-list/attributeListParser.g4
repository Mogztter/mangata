parser grammar attributeListParser;

options { tokenVocab=attributeListLexer; }

attributeList : attr ((Next | Separator) attr?)* EOF;

attr
 : AttributeNameWithValue
 | AttributeName
 | // empty
 | PositionalAttributeValue
 ;
