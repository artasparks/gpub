# GPub Processor

The gpub processor takes Raw SGFs and outputs a serialized, generalized 'book'
called a 'Spec'. There are two phases to Spec-processing:

1.  **Creation**. First a simple Spec is created, There are two options for
    creating the spec:

    1.  The spec processor generates a basic Spec based on the SGFs passed in.

    1.  The spec is manually created.

2.  **Processing**. Now that the basic Spec has been created, it is processed,
    generating positions for rendering. For example, if a PROBLEM-type position
    is passed in, it will generate a root position, and the incorrect/correct
    answers.
