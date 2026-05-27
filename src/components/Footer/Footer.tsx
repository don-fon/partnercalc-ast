import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import * as React from 'react'
import styles from './Footer.module.css'

export function Footer() {
    return <footer>
        <Grid container justifyContent="center">
            <Grid size={12}>
                <Typography textAlign="center" color="text.secondary">
                    基于 <a className={styles.link} href="https://github.com/hintxiv/ts-partnercalc" target="_blank" rel="noopener noreferrer">hintxiv/ts-partnercalc</a> 改造
                    {' '}· by <a className={styles.link} href="https://github.com/don-fon" target="_blank" rel="noopener noreferrer">don-fon</a>
                </Typography>
            </Grid>
        </Grid>
    </footer>
}
