import Head from "next/head"

interface SEOMetaProps {
  title: string
  description: string
  url?: string
  image?: string
  type?: "website" | "article"
  author?: string
  publishedTime?: string
  modifiedTime?: string
  tags?: string[]
}

export function SEOMeta({
  title,
  description,
  url,
  image,
  type = "website",
  author,
  publishedTime,
  modifiedTime,
  tags,
}: SEOMetaProps) {
  const siteName = "LocalTalk Community Forum"
  const fullTitle = `${title} | ${siteName}`
  const defaultImage = "/placeholder.svg?height=630&width=1200&text=LocalTalk+Community+Forum"

  return (
    <Head>
      {/* Basic Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <link rel="canonical" href={url} />

      {/* Open Graph Meta Tags */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content={siteName} />
      {url && <meta property="og:url" content={url} />}
      <meta property="og:image" content={image || defaultImage} />
      <meta property="og:image:alt" content={title} />

      {/* Twitter Card Meta Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image || defaultImage} />

      {/* Article-specific Meta Tags */}
      {type === "article" && (
        <>
          {author && <meta name="author" content={author} />}
          {publishedTime && <meta property="article:published_time" content={publishedTime} />}
          {modifiedTime && <meta property="article:modified_time" content={modifiedTime} />}
          {tags && tags.map((tag) => <meta key={tag} property="article:tag" content={tag} />)}
        </>
      )}

      {/* Additional SEO Meta Tags */}
      <meta name="robots" content="index, follow" />
      <meta name="googlebot" content="index, follow" />

      {/* Schema.org JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": type === "article" ? "Article" : "WebPage",
            headline: title,
            description: description,
            url: url,
            image: image || defaultImage,
            ...(type === "article" && {
              author: {
                "@type": "Person",
                name: author,
              },
              datePublished: publishedTime,
              dateModified: modifiedTime,
              publisher: {
                "@type": "Organization",
                name: siteName,
              },
            }),
          }),
        }}
      />
    </Head>
  )
}

// Generate SEO-friendly URLs
export function generateSEOUrl(title: string, id: string): string {
  const slug = title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "") // Remove special characters
    .replace(/\s+/g, "-") // Replace spaces with hyphens
    .replace(/-+/g, "-") // Replace multiple hyphens with single
    .trim()
    .substring(0, 60) // Limit length

  return `${slug}-${id}`
}

// Parse SEO URL to extract ID
export function parseSEOUrl(url: string): string {
  const parts = url.split("-")
  return parts[parts.length - 1] // Return the ID (last part)
}
