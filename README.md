# **Hugo Claris:** a fluid and responsive theme for a professional portfolio website

<img alt="iPhone 12 Pro landscape" src="./static/images/hugo-claris-demo_home_iPhone_12_Pro-landscape.png" width=844> 

### Visit the [*demo website of Hugo Claris*](https://claris.heimlicher.com/)

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

To use *Claris* as a Hugo module, create and initialize your Hugo site (if you haven't already) in three steps:

#### 2.a Create a new directory and `cd` into it

> While you could let Hugo initialize the site using `hugo new site your-hugo-site`, this will add only two files, both of which we will need to delete immediately.

```zsh
mkdir your-hugo-site
cd your-hugo-site
```

#### 2.b Initialize your site as a Hugo module

Determine, where you will put the repository of your Hugo site. The URL of the repository minus the scheme (`https://`) will be the identifier of your site's Hugo module.

For example, if you aim to put your site on GitHub and your GitHub user name is `your-username`, you would run:

```zsh
hugo mod init github.com/your-username/your-hugo-site
```

#### 2.c Add Hugo's base directories

```zsh
mkdir -p archetypes assets config content data i18n layouts static themes
```

### 3. Install the Module for Claris

In the following step, we add the Claris theme to the configuration of Hugo. This must only be done after the current directory has been initialized as a Hugo Module using the above command (`hugo mod init`...).

#### 3.a Add a reference to the Claris theme in Hugo's main configuration file

First, we need to add *Claris* as a module to the main config file of Hugo. I highly recommend that you prepare for having separate configuration files for your development and production environments. Hugo supports this via the following directory structure:

```zsh
config/_default     # Configuration that applies to all environments
config/development  # Configuration for the development environment, 
                    # builds upon `_default`
config/production   # Configuration for the production environment,
                    # builds upon `_default`
```

To configure Hugo to use the Claris theme, you edit its main configuration file to add the Claris theme under `module -> imports`.

If you are not familiar with the file format named `TOML` or, like me, just prefer `YAML`, then now is the perfect time to decide which format your config files shall use. Depending on the format you have chosen (TOML or YAML), add one of the following blocks to your main configuration file.

#### Using TOML for your configuration files

If you will use TOML, add the following block to your `config/_default/hugo.toml` file:

```toml
baseURL = "/"
title = "Hugo theme *Claris* Demo"

[module]
  [[module.imports]]
    path = "github.com/simonheimlicher/hugo-claris"
```

#### Using YAML for your configuration files

If you will use TOML, add the following block to your `config/_default/hugo.yaml`:

```yaml
baseURL: /
title: Hugo theme *Claris* Demo

module:
  imports:
    - path: github.com/simonheimlicher/hugo-claris
```

> Make sure you only have one of these two files and you do *not* have a file called `hugo.toml` or `hugo.yaml` in the root of your project.

### 3.b Fetch the Claris module

The module will be fetched by running the following command:

```zsh
hugo mod get -u
```

<details  style="cursor:pointer"><summary><strong>If this does not work...</strong></summary>

  If you add any module to the Hugo configuration without having initialized the current directory as a `Hugo Module` with `hugo mod init github.com/your-username/your-hugo-site` (see **Step 2.b** above), you will get the following error message:

  ```zsh
  Error: failed to load modules: 
  module "github.com/simonheimlicher/hugo-claris" not found in 
  ".../your-hugo-site/themes/github.com/simonheimlicher/hugo-claris";
  either add it as a Hugo Module or store it in 
  ".../your-hugo-site/themes".: module does not exist
  ```

  This error indicates that you have **correctly configured the module** to be loaded but your site's **root directory itself is not a Hugo Module.**
  
  You can easily verify this by checking if there is a file named `go.mod`:
  
  ```zsh
  cat go.mod
  ```

This should yield something along the following lines:

  ```zsh
  module github.com/simonheimlicher/vitae

  go 1.21.6

  require github.com/simonheimlicher/hugo-claris v0.0.0-20240125155746-88a461801fbe // indirect
  ```
  
  Before you try to go back to the above step, you need to temporarily rename your configuration, otherwise initializing the directory as Hugo Module will not work. To rectify the situation, you may proceed along the following lines:

  ```zsh
  mv -i config{,-disabled}

  hugo mod init github.com/your-username/your-hugo-site

  mv -i config{-disabled,}
  ```

</details>

#### 3.c Create the `index.md` for your site's home page

```zsh
hugo new content index.md
```

### 4. Run `hugo server` Locally

Start the Hugo server with:

```zsh
hugo server
```

Your site should now be running locally, accessible at `http://localhost:1313`. You can see *Claris* in action!

### 4. Deploy to Cloudflare Pages

To deploy your Hugo site with the *Claris* theme to Cloudflare Pages:

* Push your site to a GitHub repository.
* [Set up a new project on Cloudflare Pages](https://developers.cloudflare.com/pages/get-started), linking it to your GitHub repository.
* Follow the [framework-specific guide for Hugo](https://developers.cloudflare.com/pages/framework-guides/deploy-a-hugo-site/)
* Cloudflare Pages will build and deploy your site every time you push to your repository.

## Contributing

We welcome contributions to *Claris*! Whether it's bug fixes, feature additions, or improvements to the documentation, your help is appreciated. Please read our [Code of Conduct](./CODE_OF_CONDUCT.md) and [Contributing Guide](./CONTRIBUTE.md) for guidance on how to contribute.

### License

*Claris* is [MIT licensed](./LICENSE).

---

For more detailed information and advanced configuration options, visit the [Hugo Claris repository](https://github.com/simonheimlicher/hugo-claris) on GitHub.
