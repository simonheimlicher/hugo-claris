# Hugo Claris — Responsive, Modular, Modern

<img alt="iPhone 12 Pro landscape" src="./static/images/hugo-claris-demo_home_iPhone_12_Pro-landscape.png" width=844> 

### Visit an [*example website of Hugo Claris*](https://claris.heimlicher.com/)

[![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/simonheimlicher/hugo-claris/blob/main/LICENSE) &middot;
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](./CONTRIBUTE.md) &middot;
[![hugo-claris](https://img.shields.io/badge/Hugo--Themes-Hugo%20Claris-blue)](https://themes.gohugo.io/themes/hugo-claris/) &middot;
[![GitHub](https://img.shields.io/github/license/simonheimlicher/hugo-claris)](https://github.com/simonheimlicher/hugo-claris/blob/main/LICENSE) &middot;
![code-size](https://img.shields.io/github/languages/code-size/simonheimlicher/hugo-claris)

*Claris* is a theme for [Hugo](https://gohugo.io/), the world’s fastest static website generator.

* **Mobile-first:** *Claris* works great on mobile devices as well as on laptops, iMacs, and desktop PCs.
* **Responsive:** Adapts its layout and design to the device and orientation of the user.
* **Modular:** Implemented as a Hugo module, which is just a Go module.

## Responsive

### Mobile

**iPhone 12 Pro (390x844px)**

<img alt="iPhone 12 Pro portrait" src="./static/images/hugo-claris-demo_home_iPhone_12_Pro-portrait.png" width=390 height=844>

### Desktop

**WXGA 1280x720px**

<img alt="Desktop WXGA 1280x720" src="./static/images/hugo-claris-demo_home_Desktop_1280x720.png" width=1280>

<img alt="WXGA 1280x720" src="./static/images/hugo-claris-demo_footer_Desktop_1280x720.png" width=1280>

## Getting Started with Hugo Claris

Follow these steps to start using *Claris* for your Hugo site.

### 1. Get Hugo

Ensure that you have Hugo installed on your system. You need Hugo’s extended version (`0.121.0` or later). Install it from the [official Hugo website](https://gohugo.io/getting-started/installing/).

### 2. Initialize your Hugo site

To use *Claris* as a Hugo module, create and initialize your Hugo site (if you haven't already) in two steps:

#### 2a. Create a new Hugo site

```zsh
hugo new site your-hugo-site
```

#### 2a. Initialize your site as a Hugo module

Determine, where you will put the repository of your Hugo site. The URL of the repository minus the scheme (`https://`) will be the identifier of your site's Hugo module.

For example, if you aim to put your site on GitHub and your GitHub user name is `your-username`, you would run:

```zsh
hugo mod init github.com/your-username/your-hugo-site
```

### 3. Install the Module for Claris

Now, add *Claris* as a module in the main config file of Hugo located in `config/_default/hugo.toml`:

```toml
[module]
  [[module.imports]]
    path = "github.com/simonheimlicher/hugo-claris"
```

Or, in your `config/_default/hugo.yaml`:

```yaml
module:
  imports:
    - path: github.com/simonheimlicher/hugo-claris
```

The module will be fetched automatically by Hugo in the next and final step.

### 4. Run `hugo server` Locally

Start the Hugo server with:

```zsh
hugo server
```

Your site should now be running locally, accessible at `http://localhost:1313`. You can see *Claris* in action!

### 4. Deploy to Cloudflare Pages

To deploy your Hugo site with the *Claris* theme to Cloudflare Pages:

- Push your site to a GitHub repository.
- [Set up a new project on Cloudflare Pages](https://developers.cloudflare.com/pages/get-started), linking it to your GitHub repository.
- In the build settings, set the build command to `hugo` and the build output directory to `public`.
- Cloudflare Pages will build and deploy your site every time you push to your repository.

## Contributing

We welcome contributions to *Claris*! Whether it's bug fixes, feature additions, or improvements to the documentation, your help is appreciated. Please read our [Code of Conduct](./CODE_OF_CONDUCT.md) and [Contributing Guide](./CONTRIBUTE.md) for guidance on how to contribute.

### License

*Claris* is [MIT licensed](./LICENSE). 

---

For more detailed information and advanced configuration options, visit the [Hugo Claris repository](https://github.com/simonheimlicher/hugo-claris) on GitHub.
