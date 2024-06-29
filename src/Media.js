import * as React from 'react';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Skeleton from '@mui/material/Skeleton';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';

const PENDING_LEN = 10;
const img_w = 200;
const img_h = img_w * 3 / 2;

export default function Media(props) {
    let { data = [], search } = props;
    data = Array.isArray(data) ? data : new Array(PENDING_LEN);

    return (
        <Grid container spacing={2}>
            {data.map((item, index) => {
                if (search && !item.title.toLowerCase().includes(search)) {
                    return null;
                }

                return <Grid item={true} key={index} xs={12} sm={6} md={4} lg={3} display="flex" justifyContent="center">
                    {item ?
                        <MediaCard {...item} /> :
                        <MediaSkeleton />
                    }
                </Grid>
            })}
        </Grid>
    );
}

function MediaSkeleton() {
    return (
        <Box sx={{ width: 210, marginRight: 0.5, my: 5 }}>
            <Skeleton variant="rectangular" width={210} height={118} />
            <Box sx={{ pt: 0.5 }}>
                <Skeleton />
                <Skeleton width="60%" />
            </Box>
        </Box>
    );
}

function MediaCard(props) {
    let { title, image, released, imdb, dvd, blu_ray } = props;

    if (released instanceof Date) released = released.getFullYear();

    let has = []
    if (dvd) has.push('DVD')
    if (blu_ray) has.push('Blu-ray')

    has = has.length ? ` - ${has.join(', ')}` : ''

    return (
        <Card sx={{ minWidth: img_w + 50 }} >
            <CardMedia
                sx={{ height: img_h, backgroundSize: 'contain' }}
                image={image}
                title={title}
            />
            <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                    {title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    {`${released}${has}`}
                </Typography>
            </CardContent>
            <CardActions>
                <Button size="small" color="primary" href={imdb}>
                    IMDB
                </Button>
            </CardActions>
        </Card>
    );
}