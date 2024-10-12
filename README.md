

# `<myth-ring>` Web Component

The `<myth-ring>` web component will insert the webring links into your website.

## url

Use the `<myth-ring>` `url` attribute to set the location of your webring's site data:

`<myth-ring url="https://url-to-webring-data.json"></webring>`

> [!IMPORTANT] Make sure your `webring.json` server data is accessible from webring websites, and that your website `<html>` sets any Content Security Policy (CSP) required to
read the webring data.

This may involved setting a `<meta>` Content-Security Policy in your website `<head>`

e.g.
`<meta http-equiv="X-Content-Security-Policy" content="connect-src https://www.my-webring-host.com">`

## index

Use the `<myth-ring>` attribute `index=number` to set the displayed index within the webring:

`<myth-ring index="1" />`

## Slots

Set `prevsite` and `nextsite` slot child attributes to customize the display
and behaviour of 'previous' and 'next' webring links.

```html
<myth-ring>
<div slot="prevsite">
<span>{{title}}:</span>
<a href="{{url}}"><img src="{{banner}}" /></a>
<span>Created by: {{creator}}</span>
</div>
<div slot="nextsite">
<span>GO NEXT:</span>
<a href="{{url}}">{{title}}</a>
</div>
</myth-ring>
```

Within the slotted element, text escaped with `{{ prop }}` will be replaced with
the corresponding webring site data.

## Compiling `<myth-ring>` Web Component:

run `npm i` to install required js modules.

run `npm run build` to build and minify the webring.ts source.

File is output to `dist/webring.js`


