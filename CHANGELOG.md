# Change Log
## Version 0.4

[x] Settings (done in 0.4.0/1)
[x] JSX labeling (done in 0.4.2)

### 0.4.2 (latest)
added:
- JSX Elements Support
  - closing Element get label with the tag name and a list of the attributes like this: <Header left=[...], style=[...], onChange=[...]>
  - JSX labeling can be disabled with the setting [labelClosing.enableJSX]

### 0.4.1
added:
- settings for 
  - min amount of lines, which the block must have to get the tooltip [labelClosing.showToolTipMin]
  - the amount of lines that will be display in the tooltip [labelClosing.showToolTipLines]

### 0.4.0
added:
- settings for 
  - disable tooltip [labelClosing.showToolTip]
  - change font- and backgroundcolor [e.g. labelClosing.lightBackgroundColor]
  - change the min lines for comment [labelClosing.amountOfLines]
  - change the label begin sequence (seperatorChar) [labelClosing.seperatorChar]

in dev: 
- JSX Elements (done in 0.4.2)