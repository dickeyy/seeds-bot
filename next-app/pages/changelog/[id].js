import Head from 'next/head'
import { Inter } from '@next/font/google'
import { Box, Button, ChakraProvider, Heading, Spinner, Text, useColorMode, useColorModeValue } from '@chakra-ui/react'

const inter = Inter({ subsets: ['latin'] })
import theme from '../../styles/theme.js'

import NavBar from '../../comps/navbar/index.js'
import React from 'react'

import { getAllPostIds, getPostData } from '../../utils/posts';

export async function getStaticPaths() {
    // Return a list of possible value for id
    const paths = await getAllPostIds();
    return {
        paths,
        fallback: false,
    };
}

export async function getStaticProps({ params }) {
    // Fetch necessary data for the blog post using params.id
    const postData = await getPostData(params.id);
    return {
        props: {
            postData,
        },
    }
}

export default function ChangelogPage({postData}) {

    return (

        <ChakraProvider theme={theme}>
            <Head>
                <title>{postData.title}</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <NavBar />
            <Box
                as="main"
                w="100%"
                h="100%"
                p={4}
                pt={24}
                pb={24}
            >
                <Box
                    w="100%"
                    h="100%"
                    maxW="100%"
                    maxH="100%"
                    p={4}
                    pt={24}
                    pb={24}
                    borderRadius="md"
                    boxShadow="md"
                >
                    <Heading as="h1" size="2xl" mb={4}>{postData.title}</Heading>
                    <Text mb={4}>{postData.date}</Text>
                    <div dangerouslySetInnerHTML={{ __html: postData.contentHtml }} />
                </Box>
            </Box>
        </ChakraProvider>


    )
}
