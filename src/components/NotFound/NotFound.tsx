import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import { useTitle } from 'components/Title'
import React, { useEffect } from 'react'
import styles from './NotFound.module.css'

export function NotFoundPage() {
    const { setTitle } = useTitle()

    useEffect(() => setTitle('页面不存在'))

    return <div className={styles.notFound}>
        <Grid container spacing={3}>
            <Grid size={12}>
                <Typography variant="h3" textAlign="center" color="text.primary">
                    页面不存在
                </Typography>
            </Grid>
        </Grid>
    </div>
}
