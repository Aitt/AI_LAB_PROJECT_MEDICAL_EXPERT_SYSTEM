import { Box, Container, Grid, Typography } from "@mui/material";
import Link from "@mui/material/Link";
import { Facebook, Instagram, Twitter } from "@mui/icons-material";

export default function Footers() {

    return (
        <Box
            component="footer"      
            sx={{
            backgroundColor: (theme) =>
                theme.palette.mode === "light"
                ? theme.palette.grey[200]
                : theme.palette.grey[800],
            p: 6,
            }}
        >
        <Container maxWidth="lg" >
          <Grid container spacing={10}>
            <Grid item xs={12} sm={4}>
              <Typography variant="h6" color="text.primary" gutterBottom>
                About Us
              </Typography>
              <Typography variant="body2" color="text.secondary">
                We are the Medical Expert System for you
              </Typography>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Typography variant="h6" color="text.primary" gutterBottom>
                Contact Us
              </Typography>
              <Typography variant="body2" color="text.secondary">
                123 Srinakarinwirot University
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Email: ai.com
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Phone: 064 000 9999
              </Typography>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Typography variant="h6" color="text.primary" gutterBottom>
                Follow Us
              </Typography>
              <Link href="https://www.facebook.com/" color="inherit">
                <Facebook />
              </Link>
              <Link
                href="https://www.instagram.com/"
                color="inherit"
                sx={{ pl: 1, pr: 1 }}
              >
                <Instagram />
              </Link>
              <Link href="https://www.twitter.com/" color="inherit">
                <Twitter />
              </Link>
            </Grid>
          </Grid>
        </Container>
      </Box>
    );
}