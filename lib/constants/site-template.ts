export const siteName = 'Your Site';
export const siteDescription = 'Your Site Description';
export const projectName = 'Your Open Source Project';
export const projectDescription = 'Your project description';
export const homepageTitle = 'Welcome';

export const homepageTemplate = `<Section size="3">
    <Container size="3">
        <Flex direction="column" gap="6" align="center">
            <Heading size="8"><SiteName></SiteName></Heading>
            <Text as="p"><SiteDescription></SiteDescription></Text>
            <Card>
                <Box px="4">
                    <SiteOwner></SiteOwner>
                </Box>
            </Card>
        </Flex>
    </Container>
</Section>
<Section size="3" bg="rgb(243 244 246)">
    <Container size="3">
        <Flex direction="column" gap="1" align="stretch">
            <Heading size="6" align="center">Services</Heading>
            <Tiers></Tiers>
        </Flex>
    </Container>
</Section>
<Section size="3">
    <Container size="3">
        <Flex direction="column" gap="6" align="stretch">
            <Heading size="6" align="center">Custom Content</Heading>
            <Text as="p">
                Vivamus ac purus dignissim, finibus justo non, vehicula nisl. Mauris molestie blandit metus ut accumsan. Donec gravida faucibus tortor ac interdum. Integer vestibulum est ac auctor cursus. Nam accumsan velit at porta sollicitudin. Suspendisse ornare sodales faucibus. Donec mollis massa ligula, nec lacinia ex lacinia vitae. Duis at libero pharetra, venenatis mi malesuada, aliquet nisi. Suspendisse ullamcorper finibus erat ornare maximus. Nunc a auctor nisl. Aenean a lobortis risus, sit amet efficitur nunc. Integer eu vehicula velit, eget elementum ligula. Donec eget ipsum dui. Curabitur ullamcorper consequat nisl sed ultrices. Curabitur ultrices interdum accumsan. Sed id magna est.
            </Text>   
        </Flex>
    </Container>
</Section>`

export const newPageTemplate = `<Section size="3">
    <Container size="3">
        <Flex direction="column" gap="6" align="center">
            <Heading size="8">New Page</Heading>
            <Heading as="h5" size=6">Lorem ipsum dolor sit amet, consectetur adipiscing elit</Heading>
            <Text>Mauris libero nulla, tincidunt ac elit nec, vehicula pulvinar orci. Aenean consectetur odio quis congue varius. Maecenas vitae massa at nibh commodo accumsan id vel purus. Integer sodales odio sit amet justo malesuada molestie. Aliquam interdum pulvinar tempor.</Text>
        </Flex>
    </Container>
    </Section>
    <Section size="3" bg="rgb(243 244 246)">
    <Container size="3">
        <Grid columns="1fr 3fr" gap="6">
            <Card></Card>
            <Flex direction="column" gap="6" align="stretch">
                <Heading size="6" align="center">More Content</Heading>
                <Text>n hac habitasse platea dictumst. Fusce tempor tortor nec lectus lacinia fringilla. Mauris magna dui, hendrerit non vulputate viverra, scelerisque ut nisl. Integer porta, est a elementum convallis, magna dolor malesuada ex, quis aliquet augue nisi vitae eros. Integer fringilla convallis elementum. Praesent posuere nulla quis diam accumsan, ac cursus orci condimentum. Pellentesque ac turpis in augue rutrum pellentesque ac id odio. Maecenas quis odio vitae velit blandit pellentesque in non magna. Etiam ornare, ante et elementum egestas, felis velit congue felis, suscipit laoreet risus orci porttitor lacus. Nullam tincidunt tellus eget aliquet rutrum.</Text>
            </Flex>
    </Container>
</Section>`