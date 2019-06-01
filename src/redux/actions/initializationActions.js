import { Actions } from "../../values/actions";

export const InitializeApp = () => {
    return (dispatch) => {

        const centerGridWidths = {
            xs: 12, sm: 10, md: 8
        }

        dispatch({ type: Actions.SetConfig, data: {
            app: {
                title: 'NuList'
            },
            layout: {
                centerWidths: centerGridWidths,
                gutterWidths: {
                    ...Object.keys(centerGridWidths)
                        .reduce((props, next) => ({ ...props, [next]: (12 - centerGridWidths[next]) / 2 }), {})
                }
            }
        }})
 
        dispatch({ type: Actions.AppReady })
    }
}