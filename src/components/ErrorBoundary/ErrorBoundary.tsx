import Grid from '@mui/material/Grid'
import Link from '@mui/material/Link'
import Typography from '@mui/material/Typography'
import React, { ReactNode, useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import styles from './ErrorBoundary.module.css'

export function ErrorBoundary(props: { children: ReactNode }) {
    const location = useLocation()
    const [hasError, setHasError] = useState(false)

    // Reset error state when the user navigates elsewhere
    useEffect(() => setHasError(false), [location])

    // Use createElement to avoid dual @types/react conflict on class component
    return React.createElement(ErrorBoundaryClass as any, { hasError, setHasError }, props.children)
}

interface Props {
    children: ReactNode
    hasError: boolean
    setHasError: React.Dispatch<boolean>
}

interface State {
    error?: Error
}

class ErrorBoundaryClass extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props)
    }

    public componentDidCatch(error: Error) {
        this.setState({ error: error })
        this.props.setHasError(true)
    }

    public render() {
        if (!this.props.hasError) {
            return <>{this.props.children}</>
        }

        return <div className={styles.error}>
            <Grid container spacing={3}>
                <Grid size={12}>
                    <Typography variant="h3" textAlign="center" color="text.primary">
                        Oops, something went wrong!
                    </Typography>
                </Grid>
                <Grid size={12}>
                    <Typography variant="h4" textAlign="center" color="text.primary">
                        {this.state.error.message}
                    </Typography>
                </Grid>
                <Grid size={12}>
                    <Typography variant="h6" textAlign="center" color="text.primary">
                        Not sure why you're seeing this? DM me on <Link
                            href="https://discord.com/users/492781599126061066"
                            color="secondary"
                            target="_blank"
                        >
                            Discord
                        </Link>.
                    </Typography>
                </Grid>
            </Grid>
        </div>
    }
}
