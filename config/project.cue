// project.cue - Single source of truth for NSAI configuration
// Generates: manifest.json, update.json, package metadata
//
// Usage: cue export config/project.cue --out json > manifest.json

package nsai

// Project metadata
project: {
    name:        "NSAI - Neurosymbolic Research Validator"
    id:          "nsai"
    version:     "0.1.0"
    description: "Validates and prepares research data using Tractarian logical analysis. Certainty scoring for bibliographic validation."
    author:      "Hyperpolymath"
    license:     "AGPL-3.0-or-later"
    repository:  "https://github.com/Hyperpolymath/zotero-nsai"
}

// Zotero-specific configuration
zotero: {
    id:              "\(project.id)@hyperpolymath"
    min_version:     "7.0"
    max_version:     "7.*"
    update_url:      "\(project.repository)/releases/latest/download/update.json"
    manifest_version: 2
}

// Permissions required
permissions: ["storage", "tabs"]

// Icons (must exist in icons/ directory)
icons: {
    "48": "icons/nsai-48.png"
    "96": "icons/nsai-96.png"
}

// Entry points
entry: {
    background: "src/Index.res.js"
    popup:      "popup.html"
}

// Security policy
csp: "script-src 'self'; object-src 'self'"

// Generated manifest.json structure
manifest: {
    manifest_version: zotero.manifest_version
    name:             project.name
    version:          project.version
    description:      project.description
    author:           project.author
    homepage_url:     project.repository

    applications: {
        zotero: {
            id:                 zotero.id
            update_url:         zotero.update_url
            strict_min_version: zotero.min_version
            strict_max_version: zotero.max_version
        }
    }

    icons: icons

    background: {
        scripts: [entry.background]
    }

    permissions: permissions

    browser_action: {
        default_icon:  icons["48"]
        default_title: "NSAI Validator"
        default_popup: entry.popup
    }

    content_security_policy: csp
}

// Update manifest for releases
update: {
    addons: {
        "\(zotero.id)": {
            updates: [{
                version:    project.version
                update_link: "\(project.repository)/releases/download/v\(project.version)/nsai-\(project.version).xpi"
                applications: {
                    zotero: {
                        strict_min_version: zotero.min_version
                    }
                }
            }]
        }
    }
}
