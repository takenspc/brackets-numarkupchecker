# Nu Markup Checker for Brackets

A Brackets extension to add checking HTML files using the Nu Markup Checker (Validator.nu).

## HTML 4 and XHTML 1.0 Support

Althogh main objective of this extension is checking HTML5 files, it partially supports HTML 4 and XHTML 1.0. files.

- HTML 4.0 Strict
- HTML 4.0 Transitional
- HTML 4.01 Strict
- HTML 4.01 Transitional
- XHTML 1.0 Strict
- XHTML 1.0 Transitional

XHTML files which have an XML Decralation (&lt;?xml version="1.0"&gt;) are not supported. Unsupported files are checked as HTML5.

You can manually turn off HTML4 and XHTML 1.0 support (see Configurations).

## Configurations

- takenspc.numarkupchecker.url
    
    The URL of Nu Markup Checker (default is "http://validator.w3.org/nu/")
    
- takenspc.numarkupchecker.supportHTML4andXHTML
    
    Whether to enable HTML 4 and XHTML 1.0 support (default is true)
    