import Grid from '@mui/material/Grid'
import Link from '@mui/material/Link'
import Typography from '@mui/material/Typography'
import { useTitle } from 'components/Title'
import React, { useEffect } from 'react'
import styles from './NotFound.module.css'

export function NotFoundPage() {
    const { setTitle } = useTitle()

    useEffect(() => setTitle('Page not found'))

    return <div className={styles.notFound}>
        <Grid container spacing={3}>
            <Grid size={12}>
                <Typography variant="h3" textAlign="center" color="text.primary">
                    This page doesn't exist!
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
