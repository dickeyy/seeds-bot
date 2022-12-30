import { Box, ChakraProvider } from "@chakra-ui/react";
import React from "react";
import theme from "../theme";

function InvitePage() {

    React.useEffect(() => {
        // Open a new tab to the invite link
        window.location.href = 'https://discord.com/oauth2/authorize?client_id=968198214450831370&permissions=1617004133494&scope=bot%20applications.commands';
    });
    
    return (
        <ChakraProvider theme={theme}>
            <Box>

            </Box>
        </ChakraProvider>
    );
}

export default InvitePage;