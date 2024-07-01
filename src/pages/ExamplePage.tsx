import styled from "@emotion/styled";
import { Container } from "@mui/material";

export default function ExamplePage() {
    const test = async () => {
        console.log("ExamplePage");
    };
    test();

    return (
        <StyledContainer maxWidth="md">
            ExamplePage
        </StyledContainer>
    );
}

const StyledContainer = styled(Container)({
});