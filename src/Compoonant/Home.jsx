import React from 'react';
import { Box, Container, Stack } from '@mui/material';

import SaleBanner from '../Pages/Home/Banner';
import BrandsSection from '../Pages/Home/Brands';
import CategorySection from '../Pages/Home/Categoories';
import ProductCatalog from '../Pages/Home/ProductsSection';

export default function Home() {
    return (
        <Box
            component="main"
            sx={{
                width: '100%',
                overflow: 'hidden',
            }}
        >
            {/* Sale Banner */}
            <Box sx={{ width: '100%' }}>
                <SaleBanner />
            </Box>

            {/* Home Sections */}
            <Container
                maxWidth="xl"
                sx={{
                    py: { xs: 3, sm: 4, md: 6 },
                }}
            >
                <Stack
                    spacing={{ xs: 4, sm: 5, md: 7 }}
                >
                    {/* Brands */}
                    <Box sx={{ width: '100%' }}>
                        <BrandsSection />
                    </Box>

                    {/* Categories */}
                    <Box sx={{ width: '100%' }}>
                        <CategorySection />
                    </Box>

                    {/* Products */}
                    <Box sx={{ width: '100%' }}>
                        <ProductCatalog />
                    </Box>
                </Stack>
            </Container>
        </Box>
    );
}