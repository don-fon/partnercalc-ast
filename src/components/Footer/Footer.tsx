import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Icon from '@mui/material/Icon'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'
import GitHubIcon from '@mui/icons-material/GitHub'
import * as React from 'react'
import styles from './Footer.module.css'

export function Footer() {
    return <footer>
        <Grid container justifyContent="center">
            <Box>
                <Tooltip title="GitHub" placement="top">
                    <IconButton size="medium" component="a" href="https://github.com/hintxiv/ts-partnercalc" target="_blank">
                        <GitHubIcon />
                    </IconButton>
                </Tooltip>
                <Tooltip title="Discord" placement="top">
                    <IconButton size="medium" component="a" href="https://discord.com/users/492781599126061066" target="_blank">
                        <Icon className={styles.iconRoot}>
                            <img className={styles.icon} src="/Discord-Logo-White.svg" />
                        </Icon>
                    </IconButton>
                </Tooltip>
            </Box>
            <Grid size={12}>
                <Typography textAlign="center" color="text.secondary">
                    Made by Ghost Syrup @ Sargatanas.
                </Typography>
            </Grid>
        </Grid>
    </footer>
}
