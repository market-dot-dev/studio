export const siteName = 'Welcome to the Jungle';
export const siteDescription = 'This is site description, which can be edited in the site settings. Consectetur adipiscing elit. Suspendisse nec magna venenatis, dictum eros at, eleifend urna. Vestibulum vestibulum ut quam in venenatis. In rutrum augue in libero consequat tempus. Pellentesque vestibulum at ligula at posuere. Suspendisse sit amet nisl leo. Etiam aliquet nisl ut dui porta tristique. Mauris a volutpat neque. Nulla facilisi. Vestibulum porttitor auctor est vitae mattis.';
export const homepageTitle = 'Welcome';
export const homepageTemplate = `<span>
<Section size="3">
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
</Section>
</span>`