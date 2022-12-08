module.exports = {
  useHeaderHeight: jest.fn().mockImplementation(() => 200),
  getHeaderTitle: jest.fn((options, routeName) => "Test Title"),
};
