const centerGridWidths = { xs: 12, sm: 10, md: 8 }

export const StaticConfigValues = {
    app: {
        title: 'NuList'
    },
    layout: {
        centerWidths: centerGridWidths,
        gutterWidths: {
            ...Object.keys(centerGridWidths)
                .reduce((props, next) => ({ ...props, [next]: ((12 - centerGridWidths[next]) / 2) || null }), {})
        }
    }
}