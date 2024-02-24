---
title: "{{ .Name | default "Hugo Claris default template" | humanize | strings.FirstUpper }}"
date: {{ .Date }}
lastmod: {{ .Date }}
description: "Article description."
featured: false
# draft: true # When `draft` is set to `true`, this page bundle will not be rendered unless you pass the option `--buildDrafts` to `hugo`
image:
  feature: 
    src: "images/hugo_theme_claris-feature"
    alt: Feature image
    title: 
    credit: ''
  excerpt: 
    src: "images/hugo_theme_claris-thumbnail"
    alt: Excerpt image
    title: 
    credit: ''
  share: 
    src: "images/hugo_theme_claris-share"
    alt: Image for social sharing
    title: 
    credit: ''
  search: 
    src: "images/hugo_theme_claris-share"
    alt: Image for use by search engines (note that Google often just picks one of the images visible on the page, ingoring the search image)
    title: 
    credit: ''
tags:
  - Tag_name1
  - Tag_name2
categories:
  - Category_name
# series:
#   - Series_name
---

Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit.

Nam sollicitudin sit amet ex in elementum. Nulla facilisi. Quisque sit amet lectus felis. Pellentesque ut ipsum et tellus fringilla commodo. Integer et massa nibh. Nam ut semper nulla. Donec viverra semper ante, a elementum quam imperdiet aliquet. Vivamus bibendum finibus dui, id cursus eros dictum eu. Integer imperdiet ex a lectus viverra, eu tempor magna molestie. Aliquam erat volutpat. Maecenas eget nunc risus. Morbi scelerisque vestibulum nisl, sit amet bibendum lacus lacinia non.

### How to create a new Page Bundle using this archetype

You can create new [page bundles](https://gohugo.io/content-management/page-bundles/) by passing `article-bundle` via the `kind` option when creating new content, as follows:

```zsh
hugo new content --kind article-bundle articles/your-article
```

## How to add a feature image and declare the image for social sharing

To add images, put the files in their original size into the subdirectory `images` and reference the image in the front matter of this page.

## Nulla et condimentum mauris

Nulla et condimentum mauris. Maecenas quis leo laoreet metus tempus rhoncus eu et arcu. Vestibulum tristique mi vitae diam lacinia, pulvinar varius orci efficitur. Integer sed nunc a velit tempus sodales. Proin eros tortor, elementum eu ligula eu, feugiat commodo quam. Maecenas lobortis elit ut felis bibendum aliquam. Donec feugiat odio leo, eget pretium lacus scelerisque sit amet. In hac habitasse platea dictumst. Curabitur risus mauris, ullamcorper vel orci sed, commodo elementum massa. Curabitur tincidunt lobortis enim. Donec consequat diam odio, pulvinar mollis ante facilisis sed. Etiam sagittis quam eu molestie elementum. Donec sodales purus id augue semper malesuada.

## Phasellus ullamcorper dolor vel quam suscipit

Eu sagittis nisl imperdiet. Donec nec hendrerit sapien. Vivamus feugiat nunc eu tempus finibus. Nullam egestas eros non est hendrerit, et venenatis quam porta. Morbi maximus pharetra commodo. Fusce ac purus odio. Nulla arcu quam, commodo finibus sodales non, commodo a mauris. Sed eu odio lectus. Praesent ultricies a nunc eu elementum. Nulla vulputate arcu in neque bibendum tincidunt. Ut fermentum nunc nibh, in sodales risus faucibus id. Nullam ornare luctus justo, vitae dapibus sem condimentum vel. Suspendisse aliquet finibus posuere.

Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Nam at ullamcorper enim. Ut eleifend augue eget arcu tempus eleifend. Morbi suscipit sem vitae semper tristique. In hac habitasse platea dictumst. Integer luctus vel ante et placerat. Nullam id mattis libero. Aenean sed ex massa. Mauris commodo convallis lorem, eget auctor tellus facilisis in. Vivamus ac metus ut nunc tincidunt consectetur nec vitae augue. Fusce sit amet magna neque. Proin scelerisque risus at ligula mollis, fermentum lacinia augue sodales. Etiam porta est at velit vulputate, bibendum sodales nulla semper. Proin malesuada dapibus erat, eu mattis erat dictum vitae.

Duis vitae vehicula augue. Cras in nisl aliquam, placerat velit a, rhoncus metus. Sed et est nec ipsum vestibulum pellentesque. Aliquam neque elit, lobortis ac justo quis, aliquet iaculis eros. Vestibulum pharetra, felis et accumsan consectetur, turpis nibh scelerisque urna, eget egestas arcu magna eu erat. Vivamus tempus feugiat tellus, vitae euismod diam aliquet eget. Pellentesque sed dolor nisi. Fusce eget vestibulum neque. Donec facilisis lectus posuere sem hendrerit cursus. Sed elit risus, accumsan nec fringilla at, ultricies sit amet eros.

---
Photo by [Keith Misner](https://unsplash.com/photos/h0Vxgz5tyXA) on [Unsplash](https://unsplash.com/).
