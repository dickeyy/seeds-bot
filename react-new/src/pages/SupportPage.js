import { ChakraProvider } from "@chakra-ui/react";
import React from "react";
import theme from "../theme";

function SupportPage() {

    React.useEffect(() => {
        window.location.href = 'https://discord.com/invite/AU3t2yVBBe';
    });

    return (
        <ChakraProvider theme={theme}>
        </ChakraProvider>
    )
}

export default SupportPage;